async function fetchUserData(url) {
    const response = await fetch(url);
    const user = await response.json();
    displayUserData(user);
}

function displayUserData(user) {
    const usernameElement = document.getElementById('username');
    usernameElement.textContent = user.username || 'Не указано';

    const rolesElement = document.getElementById('roles');
    rolesElement.textContent = user.roles ? user.roles.map(role => role.name).join(', ').replaceAll('ROLE_', '') : 'Не указано';

    const userTableBody = document.getElementById('user-table-body');
    userTableBody.innerHTML = `<tr>
                <td>${user.id || 'Не указано'}</td>
                <td>${user.username || 'Не указано'}</td>
                <td>${user.firstName || 'Не указано'}</td> 
                <td>${user.lastName || 'Не указано'}</td>   
                <td>${user.roles ? user.roles.map(role => role.name).join(', ').replaceAll('ROLE_', '') : 'Не указано'}</td>
            </tr>`;
}

(async () => {
    await fetchUserData("/api/user");
})();
