document.getElementById('expert-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    var topic = document.getElementById('topic').value;
    if (topic) {
        showExpertProfiles(topic);
    } else {
        alert('Please enter a topic.');
    }
});

function showExpertProfiles(topic) {
    // Mock data for expert profiles
    var profiles = [
        { name: 'Expert 1', interest: 'Topic 1', profileLink: '#' },
        { name: 'Expert 2', interest: 'Topic 1', profileLink: '#' },
        { name: 'Expert 3', interest: 'Topic 1', profileLink: '#' },
        { name: 'Expert 4', interest: 'Topic 2', profileLink: '#' },
        { name: 'Expert 5', interest: 'Topic 2', profileLink: '#' },
        { name: 'Expert 6', interest: 'Topic 2', profileLink: '#' }
    ];

    var expertProfiles = document.getElementById('expert-profiles');
    expertProfiles.innerHTML = ''; // Clear previous profiles

    profiles.forEach(function(profile) {
        if (profile.interest === topic) {
            var profileDiv = document.createElement('div');
            profileDiv.classList.add('expert-profile');
            var profileName = document.createElement('p');
            profileName.textContent = profile.name;
            var profileLink = document.createElement('a');
            profileLink.textContent = 'View Profile';
            profileLink.href = profile.profileLink;
            var payLink = document.createElement('a');
            payLink.textContent = 'Pay';
            payLink.href = '#'; // Replace '#' with payment link

            profileDiv.appendChild(profileName);
            profileDiv.appendChild(profileLink);
            profileDiv.appendChild(payLink);
            expertProfiles.appendChild(profileDiv);

            // Triggering reflow to apply the fade-in animation
            profileDiv.offsetHeight;
            profileDiv.style.opacity = '1';
        }
    });

    expertProfiles.style.display = 'block';
}