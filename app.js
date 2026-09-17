//===============
//DATA 
//===============

//Two arrays hold all data in memory
let members = [];
let chores = [];

//===============
// SAVE & LOAD from localStorage
//===============

function saveData() {
    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem('chores', JSON.stringify(chores));
}
function loadData() {
    const savedMembers = localStorage.getItem('members');
    const savedChores = localStorage.getItem('chores');

    // Only load if something was actually saved before
    if (savedMembers) members = JSON.parse(savedMembers);
    if (savedChores) chores = JSON.parse(savedChores);
}

//=============
//RENDER
//=============

function renderMembers() {
    const list = document.getElementById('members-list');
    list.innerHTML = '';

    members.forEach(function(member) {
        const li = document.createElement('li');
        li.textContent = member.name;

        //Create a remove button for each member
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = function() {
            //Filter out this member from the array
            members = members.filter(function(m) {
                return m.id !== member.id;
            });
            saveData();
            renderMembers();
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

//This funtion reads the chores array and draws the list on screen
function renderChores() {
    const list = document.getElementById('chores-list');
    list.innerHTML = '';

    chores.forEach(function(chore) {
        const li = document.createElement('li');
        li.textContent = chore.name + '-' + chore.points + ' pts';

        // Crate a remove button for each chore
        const removeBtn = document.createElement('button');
        removeBtn.textContext = 'Remove';
        removeBtn.onclick = function() {
            chores = chores.filter(function(c) {
                return c.id !== chore.id;
            });
            saveData();
            renderChores();
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

//========================
// ADD MEMBERS & CHORES
//========================

// This runs when user clicks "Add Member"
function addMember() {
    const input = document.getElementById('member-input');
    const name = input.value.trim(); 

    // Don't add if the input is empty
    if (name === '') {
        alert('Please eneter a name!');
        return;
    }

    // Create a new member object with a unique id
    const newMember = {
        id: Date.now(),
        name: name 
    };

    members.push(newMember);
    saveData();
    renderMembers();
    input.value = '';
}

// This runs when user clicks "Add Chore"
function addChore() {
    const nameInput = document.getElementById('chore-input');
    const pointsInput = document.getElementById('chore-points');
    const name = nameInput.value.trim();
    const points = parseInt(pointsInput.value);

    // Don't add if the input is empty
    if (name === '') {
        alert('Please enter a chore name!');
        return;
    }

    //Create a new chore object
    const newChore = {
        id: Date.now(),
        name: name,
        points: points 
    };

    chores.push(newChore);
    saveData();
    renderChores();
    nameInput.value = '';
}

// ==============================
//THE FAIR ASSIGNMENT ALGORITHM
// ==============================

function assignChores() {
    // Can't assign if we have no members or no chores
    if (members.length === 0) {
        alert('Please add family members first!');
        return;
    }
    if (chores.length === 0) {
        alert('Please add some chores first!');
        return;
    }

    // Step 1: Give every member an empty assignment and 0 points
    let assignments = members.map(function(member) {
        return {
            id: member.id,
            name: member.name,
            assignedChores: [],
            totalPoints: 0
        };
    });

    // Step 2: Sort chores from hardest to easiest
    let sortedChores = chores.slice().sort(function(a,b) {
        return b.points - a.points;
    });

    // Step 3:Loop through each chore and give it to whoever
    // has the fewest points right now
    sortedChores.forEach(function(chore) {
        // Find the member with the lowest total points
        let lightest = assignments[0];
        assignments.forEach(function(assignment) {
            if (assignment.totalPoints < lightest.totalPoints) {
                lightest = assignment;
            }
        });

        // Give this chore to that member
        lightest.assignedChores.push(chore);
        lightest.totalPoints += chore.points;
    });

    // Step 4: Show the result on the dashboard
    renderDashboard(assignments);
}

// ==================
// RENDER DASHBOARD
//===================

function renderDashboard(assignments) {
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = ''; // Clear previous results

    assignments.forEach(function(assignment) {
        // Create a card for each family member
        const card = document.createElement('div');
        card.className = 'member-card';

        // Member name as heading
        const name = document.createElement('h3');
        name.textContent = assignment.name;
        card.appendChild(name);

        // List their assigned chores
        if (assignment.assignedChores.length === 0) {
            const none = document.createElement('p');
            none.textContent = 'No chores assigned';
            card.appendChild(none);
        } else {
            assignment.assignedChores.forEach(function(chore) {
                const choreItem = document.createElement('p');
                choreItem.textContent = '- ' + chore.name + ' (' + chore.points + ' pts)';
                card.appendChild(choreItem);
            });
        }
        

        // Show total points
        const total = document.createElement('p');
        total.className = 'points-total';
        total.textContent = 'Total: ' + assignment.totalPoints + ' points';
        card.appendChild(total);

        dashboard.appendChild(card);
    });
}

//=======================
// CONNECT BUTTONS & START APP 👨‍💻
//=======================

// Connect each button to its function
document.getElementById('add-member-btn').onclick = addMember;
document.getElementById('add-chore-btn').onclick = addChore;
document.getElementById('assign-btn').onclick = assignChores;

// Allow pressing Enter in the number input to add a member and chore
document.getElementById('member-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addMember();
});

document.getElementById('chore-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addChore();
});

// Start the app - load saved data and render everything
loadData();
renderMembers();
renderChores();