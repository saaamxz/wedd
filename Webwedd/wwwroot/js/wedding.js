document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       OPEN INVITATION
    ====================================================== */

    const openButton = document.getElementById("openInvitation");
    const hero = document.getElementById("weddingHero");


    /* =====================================================
       BACKGROUND MUSIC
    ====================================================== */

    const music = document.getElementById("weddingMusic");
    const musicToggle = document.getElementById("musicToggle");


    function playMusic() {

        if (!music) {
            console.log("Music element not found.");
            return;
        }

        music.volume = 0.35;

        const playPromise = music.play();

        if (playPromise !== undefined) {

            playPromise
                .then(function () {

                    console.log("Music is playing.");

                    if (musicToggle) {
                        musicToggle.classList.add("playing");
                    }

                })
                .catch(function (error) {

                    console.log(
                        "Music playback error:",
                        error
                    );

                });
        }
    }


    function pauseMusic() {

        if (!music)
            return;

        music.pause();

        if (musicToggle) {
            musicToggle.classList.remove("playing");
        }
    }


    /* =====================================================
       OPEN INVITATION BUTTON
    ====================================================== */

    if (openButton) {

        openButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                /* Start music after user interaction */
                playMusic();


                /* Scroll to wedding */
                if (hero) {

                    hero.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    }


    /* =====================================================
       MUSIC BUTTON
    ====================================================== */

    if (musicToggle) {

        musicToggle.addEventListener(
            "click",
            function () {

                if (!music) {
                    console.log("Music element not found.");
                    return;
                }


                if (music.paused) {

                    playMusic();

                } else {

                    pauseMusic();

                }

            }
        );

    }


    /* =====================================================
       MUSIC ERROR CHECK
    ====================================================== */

    if (music) {

        music.addEventListener(
            "error",
            function () {

                console.log(
                    "ERROR: wedding-song.mp3 could not be loaded."
                );

            }
        );

        music.addEventListener(
            "canplay",
            function () {

                console.log(
                    "Music file loaded successfully."
                );

            }
        );

    }


    /* =====================================================
       COUNTDOWN
    ====================================================== */

    const weddingDate =
        new Date(
            "November 8, 2026 18:00:00"
        ).getTime();


    function updateCountdown() {

        const now =
            new Date().getTime();

        const difference =
            weddingDate - now;


        const days =
            document.getElementById("days");

        const hours =
            document.getElementById("hours");

        const minutes =
            document.getElementById("minutes");

        const seconds =
            document.getElementById("seconds");


        if (difference <= 0) {

            if (days)
                days.textContent = "00";

            if (hours)
                hours.textContent = "00";

            if (minutes)
                minutes.textContent = "00";

            if (seconds)
                seconds.textContent = "00";

            return;
        }


        const daysValue =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hoursValue =
            Math.floor(
                (difference /
                    (1000 * 60 * 60)) % 24
            );


        const minutesValue =
            Math.floor(
                (difference /
                    (1000 * 60)) % 60
            );


        const secondsValue =
            Math.floor(
                (difference / 1000) % 60
            );


        if (days)
            days.textContent =
                String(daysValue)
                    .padStart(2, "0");


        if (hours)
            hours.textContent =
                String(hoursValue)
                    .padStart(2, "0");


        if (minutes)
            minutes.textContent =
                String(minutesValue)
                    .padStart(2, "0");


        if (seconds)
            seconds.textContent =
                String(secondsValue)
                    .padStart(2, "0");

    }


    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );

/* =====================================================
   RSVP FORM
====================================================== */

const rsvpForm =
    document.getElementById("rsvpForm");

const rsvpMessage =
    document.getElementById("rsvpMessage");

const attendanceInputs =
    document.querySelectorAll(
        'input[name="Attendance"]'
    );


if (rsvpForm) {

    rsvpForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("guestName")
                    ?.value
                    .trim();

            const guests =
                document
                    .getElementById("guestCount")
                    ?.value;

            const attendance =
                document.querySelector(
                    'input[name="Attendance"]:checked'
                );

            const guestMessage =
                document
                    .getElementById("guestMessage")
                    ?.value
                    .trim() || "";


            /* =========================
               VALIDATION
            ========================== */

            if (!name) {

                showRSVPMessage(
                    "Please enter your name.",
                    "error"
                );

                return;
            }


            if (!guests) {

                showRSVPMessage(
                    "Please select the number of guests.",
                    "error"
                );

                return;
            }


            if (!attendance) {

                showRSVPMessage(
                    "Please let us know if you will attend.",
                    "error"
                );

                return;
            }


            /* =========================
               PREPARE DATA
            ========================== */

            const formData = new FormData();

            formData.append(
                "GuestName",
                name
            );

            formData.append(
                "GuestCount",
                guests
            );

            formData.append(
                "Attendance",
                attendance.value
            );

            formData.append(
                "GuestMessage",
                guestMessage
            );


            /* =========================
               SEND TO ASP.NET
            ========================== */

            try {

                const response =
                    await fetch(
                        "/Home/SubmitRSVP",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                /* =========================
                   ERROR
                ========================== */

                if (
                    !response.ok ||
                    !result.success
                ) {

                    showRSVPMessage(
                        result.message ||
                        "Something went wrong. Please try again.",
                        "error"
                    );

                    return;
                }


                /* =========================
                   SUCCESS
                ========================== */

                showRSVPMessage(
                    result.message,
                    "success"
                );


                rsvpForm.reset();

            }
            catch (error) {

                console.error(
                    "RSVP Error:",
                    error
                );


                showRSVPMessage(
                    "Unable to send your RSVP. Please try again.",
                    "error"
                );
            }

        }
    );

}


/* =====================================================
   RSVP MESSAGE
====================================================== */

function showRSVPMessage(
    message,
    type
) {

    if (!rsvpMessage)
        return;


    rsvpMessage.textContent =
        message;


    rsvpMessage.className =
        "rsvp-message " + type;


    rsvpMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =====================================================
   ATTENDANCE CHANGE
====================================================== */

attendanceInputs.forEach(
    function (input) {

        input.addEventListener(
            "change",
            function () {

                if (!rsvpMessage)
                    return;


                rsvpMessage.textContent =
                    "";


                rsvpMessage.className =
                    "rsvp-message";

            }
        );

    }
);



    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".story-content, " +
            ".story-image, " +
            ".intro-content, " +
            ".date-content, " +
            ".event-heading, " +
            ".event-card, " +
            ".location-heading, " +
            ".location-card, " +
            ".countdown-inner, " +
            ".gallery-heading, " +
            ".gallery-item, " +
            ".rsvp-heading, " +
            ".rsvp-card"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "show-on-scroll"
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        animatedElements.forEach(
            function (element) {

                observer.observe(element);

            }
        );

    } else {

        animatedElements.forEach(
            function (element) {

                element.classList.add(
                    "show-on-scroll"
                );

            }
        );

    }


    /* =====================================================
       STAGGER EVENT CARDS
    ====================================================== */

    const eventCards =
        document.querySelectorAll(
            ".event-card"
        );


    eventCards.forEach(
        function (card, index) {

            card.style.transitionDelay =
                `${index * 0.15}s`;

        }
    );


    /* =====================================================
       STAGGER GALLERY
    ====================================================== */

    const galleryItems =
        document.querySelectorAll(
            ".gallery-item"
        );


    galleryItems.forEach(
        function (item, index) {

            item.style.transitionDelay =
                `${index * 0.12}s`;

        }
    );

});