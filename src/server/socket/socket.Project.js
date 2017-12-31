module.exports = function (io, client, realm) {
    client.on('ProjectStatus', (userId) => {
        realm.objects('User').filtered('id == $0', userId);
    });
    client.on('ProjectExist', (userId) => {
        let user = realm.objects('User').filtered('id==$0', userId)[0];
        if (!user) {
            console.log('User không tồn tại!');
        } else if (!user.projects.length) {
            console.log('Không tồn tại project');
            client.emit('Notification', 'Project is Empty. Create a new project');
        } else {
            console.log('Đã có project');
            client.emit('Notification', 'Choose project');
        }
    });
    //Tạo một project
    client.on('CreateProject', (project) => {
        realm.write(() => {
            let newProject = realm.create('Project', {
                id: project.id,
                name: project.name,
                tasks: project.tasks,
                member: project.member,
                description: project.description,
                tags: project.tags,
                channels: project.channels,
                createdate: project.createdate,
                deadline: project.deadline
            }, true);
            client.emit('Create a Successful Project', newProject);
        });
    });
    // Trả về toàn bộ thông tin của một project
    client.on('ChooseProject', (projectId) => {
        let project = getProjectById(projectId);
        client.emit('ProjectData', project);
    });
    // Show ra toàn bộ tên Task mà Project có
    client.on('GetAllTaskIdInProject', (projectId) => {
        let project = getProjectById(projectId);
        let tasksId = [];
        project.tasks.forEach(task => {
            tasksId.push(task.id);
        });
        console.log(tasksId);
        client.emit('Return Channels ID', tasksId);
    });
    // Show ra toàn bộ Channel Id mà Project có
    client.on('GetAllChannelIdInProject', (projectId) => {
        let project = getProjectById(projectId);
        let channelsId = [];
        project.channels.forEach(channel => {
            channelsId.push(channel.id);
        });
        console.log(channelsId);
        client.emit('Return Channels ID', channelsId);
    });
    // Show ra toàn bộ Member Id mà Project có
    client.on('GetAllMemberIdInProject', (projectId) => {
        let project = getProjectById(projectId);
        let membersId = [];
        project.member.forEach(member => {
            membersId.push(member.id);
        });
        console.log(membersId);
        client.emit('Return Members ID', membersId);
    });

    function getProjectById(projectId) {
        return realm.objects('Project').filtered('id == $0', projectId)[0];
    }
};