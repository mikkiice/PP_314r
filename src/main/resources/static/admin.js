document.addEventListener('DOMContentLoaded', function () {
    loadUsers();
    initializeRoles();
});

async function loadUsers() {
    const response = await fetch('/api/admin');
    const users = await response.json();
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.roles.map(role => role.name).join(', ').replaceAll('ROLE_', '')}</td>
            <td><button class="btn btn__edit" onclick="editUser(${user.id})">Edit</button></td>
            <td><button class="btn btn-danger" onclick="showDeleteModal(${user.id})">Delete</button></td>
        `;
        userTableBody.appendChild(row);
    });
}

async function loadRoles() {
    const rolesResponse = await fetch(`/api/admin/roles`);
    return await rolesResponse.json();
}

async function editUser(userId) {
    const response = await fetch(`/api/admin/${userId}`);
    const user = await response.json();

    document.getElementById('editID').value = user.id;
    document.getElementById('editName').value = user.username;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;

    const allRoles = await loadRoles();
    const rolesSelect = document.getElementById('editRoles');
    rolesSelect.innerHTML = '';

    allRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        option.selected = user.roles && user.roles.some(userRole => userRole.id === role.id);
        rolesSelect.appendChild(option);
    });

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

async function handleUserFormSubmit(event, formId, userId = null) {
    event.preventDefault();

    const form = document.getElementById(formId);
    const userData = {
        id: userId || document.getElementById('editID').value,
        username: document.getElementById('editName').value,
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        password: document.getElementById('editPassword') ? document.getElementById('editPassword').value : undefined,
        roles: Array.from(document.getElementById('editRoles').selectedOptions).map(option => ({
            id: option.value,
            name: option.textContent
        }))
    };

    const method = userId ? 'PUT' : 'POST';
    const url = userId ? `/api/admin/${userId}` : `/api/admin`;

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    await loadUsers();
    if (formId === 'editUserForm') {
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        if (editModal) editModal.hide();
    } else {
        form.reset();
        const allUsersTab = new bootstrap.Tab(document.getElementById('nav-home-tab'));
        allUsersTab.show();
    }
}

document.getElementById('editUserForm').addEventListener('submit', function(event) {
    handleUserFormSubmit(event, 'editUserForm');
});

async function handleAddUserFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('addUserForm');
    const userData = {
        username: document.getElementById('inputName').value,
        firstName: document.getElementById('inputFirstName').value,
        lastName: document.getElementById('inputLastName').value,
        password: document.getElementById('inputPassword').value,
        roles: Array.from(document.getElementById('inputRoles').selectedOptions).map(option => ({
            id: option.value,
            name: option.textContent
        }))
    };

    const response = await fetch(`/api/admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    await loadUsers();
    form.reset();
    const allUsersTab = new bootstrap.Tab(document.getElementById('nav-home-tab'));
    allUsersTab.show();
}

document.getElementById('addUserForm').addEventListener('submit', function(event) {
    handleAddUserFormSubmit(event);
});

async function showDeleteModal(userId) {
    const response = await fetch(`/api/admin/${userId}`);
    const user = await response.json();

    document.getElementById('deleteID').value = user.id;
    document.getElementById('deleteName').value = user.username;
    document.getElementById('deleteFirstName').value = user.firstName;
    document.getElementById('deleteLastName').value = user.lastName;
    const rolesContainer = document.getElementById('deleteRoles');
    rolesContainer.innerHTML = '';
    user.roles.forEach(role => {
        const option = document.createElement('option');
        option.textContent = role.name;
        rolesContainer.appendChild(option);
    });

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();

    document.getElementById('deleteChanges').onclick = async (event) => {
        event.preventDefault();
        await deleteUser(userId);
        deleteModal.hide();
    };
}

async function deleteUser(userId) {
    const response = await fetch(`/api/admin/${userId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        await loadUsers();
    }
}

async function initializeRoles() {
    const roles = await loadRoles();
    const rolesSelect = document.getElementById('inputRoles');
    rolesSelect.innerHTML = '';

    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        rolesSelect.appendChild(option);
    });
}
