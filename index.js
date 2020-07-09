const Docker = require('dockerode');
const Express = require('express');

const docker = new Docker({socketPath: '/var/run/docker.sock'});
const app = Express();

const firstOrDefault = (arr,def) => (!arr || arr.length < 1) ? def : arr[0];
const isEnabled = (value) => ['true','1','yes'].includes(value);

app.get("/containers.json", async (req,res) => {    
    const public_only = isEnabled(req.query.public_only, true);
    let allRunning = await docker.listContainers();
    const containers = allRunning.reduce( (arr,el) => {    
        const ports = el.Ports.filter(port => !(public_only && !port.PublicPort));
        if (ports.length == 0) return arr;
        arr.push({
            Name: firstOrDefault(el.Names).substring(1),
            Image: el.Image,
            Ports: ports,
            Runned: el.Status
        });
        return arr;
    }, [] );    
    res.send(containers);
});

const server = app.listen(3000, () => {
    console.log("Server started at port 3000!");
});

process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
});