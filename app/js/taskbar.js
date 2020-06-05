const taskbarFunctions = require('./js/js_functions/taskbar_functions');

/**
 * Top user information logistics
 */
const uname = localStorage.getItem('displayName');
document.getElementById('username').innerHTML = uname;
document.getElementById('userStatus').onchange = function () {
  const { value } = document.getElementById('userStatus');
  taskbarFunctions.onStatusChange(uname, value);
};
const thermometer = document.getElementById('thermometer');

// Top right log out button logistics
const logoutButton = document.getElementById('logOutBtn');
logoutButton.addEventListener('click', () => taskbarFunctions.logout());

// Left column logistics
const startFlowButton = document.getElementById('startFlowButton');
startFlowButton.addEventListener('click', () => { document.location.href = 'checkin.html'; });

const endFlowButton = document.getElementById('endFlowButton');
endFlowButton.addEventListener('click', () => { document.location.href = 'checkout.html'; });

const flowDiv = document.getElementById('flowDiv');
const teamNoneDiv = document.getElementById('teamNoneDiv');
const teamExistsDiv = document.getElementById('teamExistsDiv');
flowDiv.style.display = 'none';
teamNoneDiv.style.display = 'none';
teamExistsDiv.style.display = 'none';
endFlowButton.style.display = 'none';


// Right column logistics
const createTeamButton = document.getElementById('createTeamButton');
createTeamButton.addEventListener('click', () => { document.location.href = 'createteam.html'; });
const joinTeamButton = document.getElementById('joinTeamButton');
joinTeamButton.addEventListener('click', () => { document.location.href = 'jointeam.html'; });
const leaveTeamButton = document.getElementById('leaveTeamButton');
leaveTeamButton.addEventListener('click', () => taskbarFunctions.leaveTeam());

// Call initializers in the backend
taskbarFunctions.checkTeams(thermometer, teamNoneDiv, flowDiv, teamExistsDiv, startFlowButton, endFlowButton);
taskbarFunctions.initUser(uname);