const fs = require('fs');
const {openai, getFineTuningModelName, updateFineTuningModelName} = require('../configs/openai');
const path = require('path');
require('dotenv').config()

const inputFile = path.join(__dirname, "feedbacks.jsonl");
const outputFile = path.join(__dirname, "final_test_data.jsonl");
const timeFile = path.join(__dirname, "last_run_time.txt");

async function upload_file() {
    const file = await openai.files.create({
        file: fs.createReadStream(outputFile),
        purpose: 'fine-tune'
    })
   return file.id;
}


async function create_fine_tuning_job (file_id){
    const fineTune = await openai.fineTuning.jobs.create({ 
        training_file: file_id ,
        model: 'gpt-3.5-turbo' });
    return fineTune.id;
}

async function retrieve_fine_tuning_job (job_id){
    const fineTune = await openai.fineTuning.jobs.retrieve(job_id)
    listEvents = fineTune.id;
    return fineTune;
}


function saveCurrentTime() {
    const currentTime = new Date();
    const formattedTime = currentTime.toString();

    fs.writeFileSync(timeFile, formattedTime, 'utf8');
}

// Function để kiểm tra xem đã qua 1 phút chưa
function canRetrain(lastTime) {
    const currentTime = new Date();
    const lastRunTime = new Date(lastTime);
    const elapsedTime = (currentTime - lastRunTime) / 1000; // Chuyển đổi từ mili giây sang giây

    return elapsedTime >= 30 * 24 * 60 * 60 * 1000; // Kiểm tra nếu đã qua 30 ngày
}

// Function để đọc thời gian lần chạy trước từ file
function readLastRunTime() {
    try {
        const data = fs.readFileSync(timeFile, 'utf8');
        return data.trim();
    } catch (err) {
        // Nếu không có file hoặc có lỗi khi đọc, trả về null
        return null;
    }
}

function retrain() {
    if (lastRunTime !== null && !canRetrain(lastRunTime)) {
        console.log('Program was executed within last 30 days. Skipping...');
        return;
    }

    fs.readFile(inputFile, 'utf8' , async (err,data) => {
        if (err) {
            console.error('Error reading file', err) ;
            return;
        }
        
        console.log("Filtering feedbackes...");
        const lines = data.trim().split('\n');
        const modifiedFeedbacks = [];
        lines.forEach(line => {
            try {
                const feedback = JSON.parse(line);
                
                if (feedback.rating > 3 ) {
                    delete feedback.rating;
                    modifiedFeedbacks.push(feedback);
                }
            } catch (err) {
                console.error('Error parsing JSON' ,err);
            }
        });
    
        console.log("Adding good feedback to train data...");
        const outputData = modifiedFeedbacks.map(feedback => JSON.stringify(feedback)).join('\n');
        fs.appendFileSync(outputFile,outputData, 'utf8' ,(err) =>{
            if (err) {
                console.error('Error writing file : ', err);
                return;
            }
            console.log('Modified data has been written to', outputFile);
        })

        console.log("Uploading file to OPENAI...");
        const file_id = await upload_file();

        console.log("Started retraining, please wait ...");
        const job_id = await create_fine_tuning_job(file_id);

        const fine_tuning_interval = setInterval(async () => {
            const fine_tuning_job = await retrieve_fine_tuning_job(job_id);
            if (fine_tuning_job.status === "succeeded") {
                // openai.models.delete(getModelId());
                updateFineTuningModelName(fine_tuning_job.fine_tuned_model);
                console.log("Job", job_id, fine_tuning_job.status);
                clearInterval(fine_tuning_interval);
            }
            else if (fine_tuning_job.status === "failed" || fine_tuning_job.status === "cancelled") {
                console.log("Job", job_id, fine_tuning_job.status);
                clearInterval(fine_tuning_interval);
            }
            else console.log("Watting for fine tuning job", job_id);
        }, 5 * 60 * 1000);//5 minute
        
        saveCurrentTime();
        console.log('Program executed successfully.');
    });

}

module.exports = {
    retrain
}