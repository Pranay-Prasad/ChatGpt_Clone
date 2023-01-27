
// 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
const { Configuration, OpenAIApi } =  require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require("body-parser");
const configuration = new Configuration({
    organization: "org-YxSx5KEK8BM105vQGBpwyHkh",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());
app.post('/',async (req,res) => {
    const {message,currentmodel} = req.body;
    const response = await openai.createCompletion({
        model: `${currentmodel}`,
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0.5,
    });
    res.json({
        message: response.data.choices[0].text
    })
})
app.get('/models',async(req,res) => {
    const response = await openai.listEngines();
    console.log(response.data);
    res.json({
        models: response.data.data
    })
})
app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
})