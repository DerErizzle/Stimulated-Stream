document.addEventListener('DOMContentLoaded', function () {
    const audioPlayer = document.getElementById('audioPlayer');
    const audioFiles = [
        '/assets/sounds/lofi/counting-sheep.webm',
        '/assets/sounds/lofi/pageantry.webm',
        '/assets/sounds/lofi/pinwheel.webm',
        '/assets/sounds/lofi/retrogress.webm',
        '/assets/sounds/lofi/secret.webm',
        '/assets/sounds/lofi/tapestry.webm',
        '/assets/sounds/lofi/tokyo.webm',
        '/assets/sounds/lofi/vaquero.webm',
        '/assets/sounds/lofi/what-next.webm',
        '/assets/sounds/lofi/woefully.webm'
    ];

    const startButton = document.getElementById('startButton');
    const obsLink = document.getElementById('obsLink');
    const overlayBlocker = document.getElementById('overlayBlocker');
    const obsText = document.querySelector('.obs-text');
    const copyMessage = document.getElementById('copyMessage');
    let playbackInitiated = false;


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let currentTrackIndex = 0;
    let shuffledTracks;

    function playNextTrack() {
        if (!shuffledTracks || currentTrackIndex >= shuffledTracks.length) {
            shuffledTracks = [...audioFiles];
            shuffleArray(shuffledTracks);
            currentTrackIndex = 0;
        }
        audioPlayer.src = shuffledTracks[currentTrackIndex];
       const playPromise =  audioPlayer.play();
        if (playPromise !== undefined) {
             playPromise.catch(error => {
                 console.error("Playback failed: ", error);
                 showStartButton();
             });
        }
        currentTrackIndex++;
    }

    audioPlayer.addEventListener('ended', playNextTrack);


    function playVideos(){
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.play().catch(e => {
            console.log("Video Playback error: ",e);
            showStartButton();
        }));

    }

     function showStartButton(){
         if(!playbackInitiated){
             startButton.style.display = 'block';
              overlayBlocker.style.display = 'block';
              obsText.style.display = 'block';
         }
     }

      startButton.addEventListener('click', () =>{
          playVideos();
          playNextTrack();
          startButton.style.display = 'none';
          overlayBlocker.style.display = 'none';
          obsText.style.display = 'none';
          playbackInitiated = true;
      });

      obsLink.addEventListener('click', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(obsLink.textContent)
          .then(() => {
              console.log('URL copied to clipboard');
             copyMessage.style.display = 'inline';
           setTimeout(function() {
               copyMessage.style.display = 'none';
           }, 2000);
          })
            .catch(err => {
            console.error('Failed to copy: ', err);
          });
        });

    playVideos();
    playNextTrack();

    document.getElementById('subwaySurfersVideo').volume = 1;
    document.getElementById('fitnessVideo').volume = 1;
    document.getElementById('slimeVideo').volume = 0.3;
    document.getElementById('mukbangVideo').volume = 1;
        document.getElementById('streamerVideo').volume = 1;
    audioPlayer.volume = 0.3;


    function loadVideo(videoElement, normalSrc, smallSrc) {
        let loadStartTime = null;

        videoElement.addEventListener('loadstart', () => {
            loadStartTime = new Date().getTime();
            console.log(`Loading video: ${normalSrc}`);
        });

        videoElement.addEventListener('error', () => {
            const currentTime = new Date().getTime();
            const loadingTime = currentTime - loadStartTime;

            console.log(`Error loading: ${normalSrc} after ${loadingTime}ms`);
            if (loadingTime > 500) {
                videoElement.src = smallSrc;
                videoElement.load();
                console.log(`Switching to small video: ${smallSrc}`);
            }
        });
    }
    loadVideo(document.getElementById('fitnessVideo'), '/assets/videos/fitness.webm', '/assets/videos/fitness-small.webm');
    loadVideo(document.getElementById('mukbangVideo'), '/assets/videos/mukbang.webm', '/assets/videos/mukbang-small.webm');
    loadVideo(document.getElementById('slimeVideo'), '/assets/videos/slime.webm', '/assets/videos/slime-small.webm');
});