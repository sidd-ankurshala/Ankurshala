const container = document.getElementById('video-container');
const button = document.getElementById('get-video');

button.addEventListener('click', () => {
  Twilio.Video.createLocalVideoTrack().then(track => {
    container.append(track.attach());
    const name = document.createElement("p");
    name.classList.add("name");
    name.append(document.createTextNode("Dheerandra Nema"));
    container.append(name);
    button.remove();
  });
})