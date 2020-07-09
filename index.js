const Docker = require('dockerode');
const Express = require('express');

const docker = new Docker({socketPath: '/var/run/docker.sock'});
const app = Express();

const firstOrDefault = (arr,def) => (!arr || arr.length < 1) ? def : arr[0];

app.get("/containers.json", async (req,res) => {
    let containers = await docker.listContainers();
    containers = containers.reduce((arr,el) => {
        if (!el.Ports || el.Ports.length == 0) return arr;
        arr.push({
            Name: firstOrDefault(el.Names).substring(1),
            Image: el.Image,
            Ports: el.Ports,
            Runned: el.Status
        });
        return arr;
    }, []);    
    res.send(containers);
});

const server = app.listen(3000, ()=>{
    console.log("Server started at port 3000!");
});

process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
});