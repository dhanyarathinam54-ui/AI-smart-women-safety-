/* =====================================================
   VAZHI THUNAI FRONTEND
===================================================== */


/* =====================================================
   BACKEND CONFIGURATION
===================================================== */

/*
   IMPORTANT:

   These are placeholders until the backend team
   confirms the exact FastAPI endpoints from /docs.

   Do NOT change the UI for this.

   Later only these API values need to be updated.
*/

const API_BASE_URL = "http://127.0.0.1:8000";

const SOS_API = "/sos";

const VOICE_API = "/voice";


/* =====================================================
   PAGE NAVIGATION
===================================================== */

const pages =
    document.querySelectorAll(".page");

const navLinks =
    document.querySelectorAll(".nav-link");


function showPage(pageName) {

    pages.forEach(function(page) {

        page.classList.remove(
            "active-page"
        );

    });


    navLinks.forEach(function(link) {

        link.classList.remove(
            "active"
        );

    });


    const selectedPage =
        document.getElementById(pageName);


    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

    }


    const selectedLink =
        document.querySelector(
            `[data-page="${pageName}"]`
        );


    if (selectedLink) {

        selectedLink.classList.add(
            "active"
        );

    }


    /*
       URL changes without creating
       another HTML file.

       Example:

       index.html#home
       index.html#safety
       index.html#contacts
       index.html#location
    */

    history.replaceState(
        null,
        "",
        "#" + pageName
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    /*
       When Location page is opened,
       request location.
    */

    if (pageName === "location") {

        getCurrentLocation();

    }

}


navLinks.forEach(function(link) {

    link.addEventListener(
        "click",
        function() {

            const pageName =
                this.dataset.page;

            showPage(pageName);

        }
    );

});


/* =====================================================
   LOAD PAGE FROM URL
===================================================== */

function loadInitialPage() {

    let pageName =
        window.location.hash
            .replace("#", "");

    const validPages = [
        "home",
        "safety",
        "contacts",
        "location"
    ];


    if (!validPages.includes(pageName)) {

        pageName = "home";

    }


    showPage(pageName);

}


window.addEventListener(
    "load",
    loadInitialPage
);


/* =====================================================
   LOCATION
===================================================== */

let currentLocation = {

    latitude: null,

    longitude: null

};


function getCurrentLocation() {

    if (!navigator.geolocation) {

        updateLocationUI(
            "Location not supported"
        );

        return;

    }


    updateLocationUI(
        "Getting location..."
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            currentLocation.latitude =
                position.coords.latitude;

            currentLocation.longitude =
                position.coords.longitude;


            const latitude =
                document.getElementById(
                    "latitude"
                );


            const longitude =
                document.getElementById(
                    "longitude"
                );


            if (latitude) {

                latitude.textContent =
                    currentLocation.latitude
                    .toFixed(6);

            }


            if (longitude) {

                longitude.textContent =
                    currentLocation.longitude
                    .toFixed(6);

            }


            updateLocationUI(
                "Location Ready"
            );

        },


        function(error) {

            console.log(
                "Location error:",
                error
            );


            updateLocationUI(
                "Allow location access"
            );

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 30000

        }

    );

}


function updateLocationUI(message) {

    const safetyStatus =
        document.getElementById(
            "safetyLocationStatus"
        );


    if (safetyStatus) {

        safetyStatus.textContent =
            message;

    }

}


/* =====================================================
   LOCATION BUTTON
===================================================== */

const locationButton =
    document.getElementById(
        "locationButton"
    );


if (locationButton) {

    locationButton.addEventListener(
        "click",
        getCurrentLocation
    );

}


/* =====================================================
   SOS 2 SECOND HOLD
===================================================== */

const sosButton =
    document.getElementById(
        "sosButton"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const holdText =
    document.getElementById(
        "holdText"
    );


let sosTimer = null;

let sosStartTime = null;

let sosCompleted = false;


const SOS_HOLD_TIME = 2000;


/* START HOLD */

function startSOSHold() {

    if (sosTimer !== null) {

        return;

    }


    sosCompleted = false;

    sosStartTime =
        Date.now();


    if (holdText) {

        holdText.textContent =
            "Keep holding...";

    }


    updateSOSProgress();


    sosTimer =
        setTimeout(

            function() {

                sosCompleted = true;

                resetSOSHold();

                triggerSOS(
                    "SOS_BUTTON"
                );

            },

            SOS_HOLD_TIME

        );

}


/* PROGRESS */

function updateSOSProgress() {

    if (!sosStartTime) {

        return;

    }


    const elapsed =
        Date.now() - sosStartTime;


    const percentage =
        Math.min(

            (elapsed / SOS_HOLD_TIME)
            * 100,

            100

        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    if (percentage < 100) {

        requestAnimationFrame(
            updateSOSProgress
        );

    }

}


/* CANCEL */

function cancelSOSHold() {

    if (sosCompleted) {

        return;

    }


    resetSOSHold();

}


/* RESET */

function resetSOSHold() {

    if (sosTimer !== null) {

        clearTimeout(
            sosTimer
        );

        sosTimer = null;

    }


    sosStartTime = null;


    if (progressBar) {

        progressBar.style.width =
            "0%";

    }


    if (holdText) {

        holdText.textContent =
            "Hold the button for 2 seconds";

    }

}


/* =====================================================
   SOS EVENTS
===================================================== */

if (sosButton) {


    /* Desktop */

    sosButton.addEventListener(
        "mousedown",
        startSOSHold
    );


    sosButton.addEventListener(
        "mouseup",
        cancelSOSHold
    );


    sosButton.addEventListener(
        "mouseleave",
        cancelSOSHold
    );


    /* Mobile */

    sosButton.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            startSOSHold();

        }
    );


    sosButton.addEventListener(
        "touchend",
        function(event) {

            event.preventDefault();

            cancelSOSHold();

        }
    );

}


/* =====================================================
   HOME SOS BUTTON
===================================================== */

const homeSosButton =
    document.getElementById(
        "homeSosButton"
    );


if (homeSosButton) {

    homeSosButton.addEventListener(
        "click",
        function() {

            triggerSOS(
                "SOS_BUTTON"
            );

        }
    );

}


/* =====================================================
   TRIGGER SOS
===================================================== */

async function triggerSOS(
    triggerType
) {

    /*
       First obtain location.
    */

    getCurrentLocation();


    /*
       Show emergency modal.
    */

    openSOSModal(
        triggerType
    );


    /*
       Data sent to backend.

       This structure will be changed
       if backend /docs uses different
       field names.
    */

    const payload = {

        trigger: triggerType,

        latitude:
            currentLocation.latitude,

        longitude:
            currentLocation.longitude,

        timestamp:
            new Date().toISOString()

    };


    console.log(
        "SOS PAYLOAD:",
        payload
    );


    /*
       Send to FastAPI
    */

    try {

        const response =
            await fetch(

                API_BASE_URL +
                SOS_API,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }

            );


        if (!response.ok) {

            throw new Error(
                "SOS API Error"
            );

        }


        const data =
            await response.json();


        console.log(
            "SOS RESPONSE:",
            data
        );


        setModalBackendStatus(
            "Request Sent"
        );

    }


    catch(error) {

        console.log(
            "Backend connection:",
            error
        );


        /*
           Frontend is still working.

           Backend endpoint will be connected
           after exact /docs details are confirmed.
        */

        setModalBackendStatus(
            "Backend Pending"
        );

    }

}


/* =====================================================
   SOS MODAL
===================================================== */

const sosModal =
    document.getElementById(
        "sosModal"
    );


const closeModalButton =
    document.getElementById(
        "closeModal"
    );


function openSOSModal(
    triggerType
) {

    if (!sosModal) {

        return;

    }


    sosModal.classList.add(
        "show"
    );


    const trigger =
        document.getElementById(
            "modalTrigger"
        );


    const location =
        document.getElementById(
            "modalLocation"
        );


    if (trigger) {

        trigger.textContent =
            triggerType === "VOICE"

                ? "Voice Trigger"

                : "SOS Button";

    }


    if (location) {

        if (

            currentLocation.latitude !== null

        ) {

            location.textContent =
                "Attached";

        }

        else {

            location.textContent =
                "Getting...";

        }

    }

}


function closeSOSModal() {

    if (sosModal) {

        sosModal.classList.remove(
            "show"
        );

    }

}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeSOSModal
    );

}


function setModalBackendStatus(
    status
) {

    const backend =
        document.getElementById(
            "modalBackend"
        );


    if (backend) {

        backend.textContent =
            status;

    }

}


/* =====================================================
   VOICE SOS
===================================================== */

const voiceButton =
    document.getElementById(
        "voiceButton"
    );


let mediaRecorder = null;

let audioChunks = [];

let voiceRecording = false;


/* START VOICE */

async function startVoiceSOS() {

    try {

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    audio: true

                });


        mediaRecorder =
            new MediaRecorder(
                stream
            );


        audioChunks = [];


        mediaRecorder.ondataavailable =
            function(event) {

                if (
                    event.data.size > 0
                ) {

                    audioChunks.push(
                        event.data
                    );

                }

            };


        mediaRecorder.onstop =
            async function() {

                const audioBlob =
                    new Blob(

                        audioChunks,

                        {

                            type:
                                mediaRecorder.mimeType

                        }

                    );


                stream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );


                await sendVoiceToBackend(
                    audioBlob
                );

            };


        mediaRecorder.start();


        voiceRecording = true;


        voiceButton.textContent =
            "⏹ Stop Voice SOS";


        updateVoiceStatus(
            "Listening..."
        );

    }


    catch(error) {

        console.log(
            "Microphone error:",
            error
        );


        alert(
            "Please allow microphone access."
        );

    }

}


/* STOP VOICE */

function stopVoiceSOS() {

    if (

        mediaRecorder &&

        mediaRecorder.state !==
        "inactive"

    ) {

        mediaRecorder.stop();

    }


    voiceRecording = false;


    voiceButton.textContent =
        "🎙️ Start Voice SOS";


    updateVoiceStatus(
        "Processing..."
    );

}


/* VOICE BUTTON */

if (voiceButton) {

    voiceButton.addEventListener(
        "click",
        function() {

            if (voiceRecording) {

                stopVoiceSOS();

            }

            else {

                startVoiceSOS();

            }

        }
    );

}


/* =====================================================
   SEND VOICE TO FASTAPI
===================================================== */

async function sendVoiceToBackend(
    audioBlob
) {

    const formData =
        new FormData();


    formData.append(
        "audio",
        audioBlob,
        "voice.webm"
    );


    try {

        const response =
            await fetch(

                API_BASE_URL +
                VOICE_API,

                {

                    method: "POST",

                    body: formData

                }

            );


        if (!response.ok) {

            throw new Error(
                "Voice API Error"
            );

        }


        const data =
            await response.json();


        console.log(
            "VOICE RESPONSE:",
            data
        );


        updateVoiceStatus(
            "Voice Processed"
        );


        /*
           Backend response field names
           must be confirmed from /docs.

           This is temporary handling.
        */

        if (

            data.sos === true ||

            data.detected === true ||

            data.trigger === "SOS"

        ) {

            triggerSOS(
                "VOICE"
            );

        }

    }


    catch(error) {

        console.log(
            "Voice backend:",
            error
        );


        updateVoiceStatus(
            "Backend Pending"
        );

    }

}


/* =====================================================
   VOICE STATUS
===================================================== */

function updateVoiceStatus(
    status
) {

    const voiceStatus =
        document.getElementById(
            "voiceStatus"
        );


    if (voiceStatus) {

        voiceStatus.textContent =
            status;

    }

}


/* =====================================================
   CONTACT BUTTONS
===================================================== */

const contactButtons =
    document.querySelectorAll(
        ".contact-call"
    );


contactButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const name =
                    this.dataset.contact;


                alert(

                    name +
                    " call action will be handled by the backend."

                );

            }
        );

    }
);


/* =====================================================
   KEYBOARD ACCESSIBILITY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        /*
           ESC closes SOS modal.
        */

        if (
            event.key === "Escape"
        ) {

            closeSOSModal();

        }

    }
);