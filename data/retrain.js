const fs = require('fs');
const { env } = require('process');

const {OpenAI} = require('openai')
require('dotenv').config()

const inputFile = "feedbacks.jsonl";
const outputFile = "train_feedbacks.jsonl";
const timeFile = "last_run_time.txt";


const initMessages = {
    messages: [
        {
          role: "system",
          content: "You are a psychologist"
        },
        {
          content: "Xin chào, tôi là PsyBot, tôi có thể giúp gì cho bạn!",
          role: "assistant"
        }
    ]
}

const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

module.exports = {
    initMessages,
    openai
}

var id_file;
var id_retrieve;
var listEvents;

async function upload() {
    const file = await openai.files.create({
        file: fs.createReadStream(outputFile),
        purpose: 'fine-tune'
    })
   id_file = file.id;
   console.log(id_file);
}


async function run_fine_tuning_jobs (id_file){
    const fineTune = await openai.fineTuning.jobs.create({ 
        training_file: id_file ,
        model: 'gpt-3.5-turbo' });
    id_retrieve = fineTune.id;
    console.log(id_retrieve);
}

async function run_fine_tuning_retrieve (id_retrieve){
    const fineTune = await openai.fineTuning.jobs.retrieve(id_retrieve)
    listEvents = fineTune.id;
    console.log(listEvents);
}

async function run_fine_tuning_listEvents (listEvents){
    const fineTune = await openai.fineTuning.jobs.listEvents(listEvents)
    console.log(fineTune);
}


function saveCurrentTime() {
    const currentTime = new Date();
    const formattedTime = currentTime.toString();

    fs.writeFileSync(timeFile, formattedTime, 'utf8');
}

// Function để kiểm tra xem đã qua 1 phút chưa
function isOneMinutePassed(lastTime) {
    const currentTime = new Date();
    const lastRunTime = new Date(lastTime);
    const elapsedTime = (currentTime - lastRunTime) / 1000; // Chuyển đổi từ mili giây sang giây

    return elapsedTime >= 1209600; // Kiểm tra nếu đã qua 14 ngày
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

function runProgram() {
    fs.readFile(inputFile, 'utf8' , (err,data) => {
        if (err) {
            console.error('Error reading file', err) ;
            return;
        }
        
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
    
        const outputData = modifiedFeedbacks.map(feedback => JSON.stringify(feedback)).join('\n');
        fs.writeFile(outputFile,outputData, 'utf8' ,(err) =>{
            if (err) {
                console.error('Error writing file : ', err);
                return;
            }
            console.log('Modified data has been written to', outputFile);
        })

        if (modifiedFeedbacks.length >= 10) {

            console.log('outputFile contains at least 10 elements.');
            
            (async () => {
                await upload(); 
                console.log(id_file); 
                await run_fine_tuning_jobs(id_file);
                await run_fine_tuning_retrieve (id_retrieve);
                await run_fine_tuning_listEvents (listEvents);
            })();
            
            console.log('Program executed successfully.');
           
            saveCurrentTime();

        } else {
            console.log('outputFile does not contain at least 10 elements.');
        }

    });

}

const lastRunTime = readLastRunTime();

if (lastRunTime === null || isOneMinutePassed(lastRunTime)) {
    runProgram();
} else {
    console.log('Program was executed within last 14 days. Skipping...');
}