const sendHandler = res => data => res.status(200).send(data);

const catchHandler = (res, description = '', data) => ({message}) => {
    console.log('Error !!! ', description, data || ' ', message);
    res.status(400).send(JSON.stringify({message}))
}

module.exports = {
    sendHandler,
    catchHandler
}