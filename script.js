document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');

    // Check if the preloader has already been shown in this session
    if (sessionStorage.getItem('preloaderShown')) {
        if (preloader) {
            preloader.remove(); // Remove it immediately
        }
        initPage(); // Initialize the page directly
    } else if (preloader) {
        // First visit in this session, show the preloader
        document.body.classList.add('preloading');

        // T = 1s : Début du fade out
        setTimeout(() => {
            preloader.style.opacity = '0';

            // After the CSS transition (0.5s), remove the element
            setTimeout(() => {
                preloader.remove();
                document.body.classList.remove('preloading');
                initPage();
            }, 500);
        }, 1000);

        // Set the flag in sessionStorage so it doesn't show again
        sessionStorage.setItem('preloaderShown', 'true');
    } else {
        // Fallback if there is no preloader on the page (like info.html)
        sessionStorage.setItem('preloaderShown', 'true');
        initPage();
    }

    /**
     * Initialise les fonctionnalités de la page (curseur, survol, etc.)
     * C'est votre code original.
     */
    function initPage() {
        const cursor = document.querySelector('.cursor-follower');
        const navItems = document.querySelectorAll('.nav-item');
        let isNavHover = false;

        // Gestion du curseur personnalisé
        if (window.matchMedia("(pointer: fine)").matches) {
            document.addEventListener('mousemove', (e) => {
                let transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
                if (isNavHover) transform += ' scale(1.5)';
                if (cursor) cursor.style.transform = transform;
            });
        }

        // Délégation pour le survol des projets (gère aussi les clones)
        document.addEventListener('mouseover', (e) => {
            const item = e.target.closest('.project-item');
            if (item && cursor) {
                cursor.textContent = item.getAttribute('data-title');
                cursor.classList.add('active');
            }
        });
        document.addEventListener('mouseout', (e) => {
            const item = e.target.closest('.project-item');
            if (item && cursor) {
                cursor.textContent = '';
                cursor.classList.remove('active');
            }
        });

        // Initialisation de la bande défilante infinie
        const strip = document.querySelector('.project-strip');
        const track = document.querySelector('.project-track');
        if (strip && track) {
            const items = Array.from(track.children);
            // Duplication pour assurer la continuité du scroll
            items.forEach(item => track.appendChild(item.cloneNode(true)));
            items.forEach(item => track.insertBefore(item.cloneNode(true), track.firstChild));

            const originalWidth = track.scrollWidth / 3;
            strip.scrollLeft = originalWidth;

            strip.addEventListener('scroll', () => {
                if (strip.scrollLeft >= originalWidth * 2) strip.scrollLeft -= originalWidth;
                else if (strip.scrollLeft <= 0) strip.scrollLeft += originalWidth;
            });

            const autoScroll = () => {
                const speed = window.innerWidth <= 768 ? 1.5 : 0.5;
                strip.scrollLeft += speed;
                requestAnimationFrame(autoScroll);
            };
            autoScroll();
        }
        if (strip) {
            strip.addEventListener('mouseenter', () => {
                if (cursor) cursor.classList.add('project-hover');
            });

            strip.addEventListener('mouseleave', () => {
                if (cursor) cursor.classList.remove('project-hover');
            });
        }
        // Gestion Overlay Contact centralisée
        const contactBtn = document.getElementById('contact-btn');
        const contactOverlay = document.getElementById('contact-overlay');
        if (contactBtn && contactOverlay) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Évite que le clic ne soit immédiatement capté par l'overlay
                const isActive = contactOverlay.classList.toggle('active');
                document.body.classList.toggle('overlay-open', isActive);
            });

            // Fermer au clic sur l'overlay (n'importe où : fond, texte, etc.)
            contactOverlay.addEventListener('click', () => {
                contactOverlay.classList.remove('active');
                document.body.classList.remove('overlay-open');
            });

            // Empêcher la fermeture lors du clic sur les liens (e-mail, tel, réseaux)
            const contactLinks = contactOverlay.querySelectorAll('a');
            contactLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            // Fermer avec la touche Échap
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && contactOverlay.classList.contains('active')) {
                    contactOverlay.classList.remove('active');
                    document.body.classList.remove('overlay-open');
                }
            });
        }

        // Duplication de l'Expertise List pour le loop mobile
        const expertiseList = document.querySelector('.expertise-list');
        if (expertiseList) {
            expertiseList.innerHTML += expertiseList.innerHTML;
        }

        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                isNavHover = true;
                if (cursor) cursor.classList.add('nav-hover');
            });
            item.addEventListener('mouseleave', () => {
                isNavHover = false;
                if (cursor) cursor.classList.remove('nav-hover');
            });
        });

        // --- Toggle More Info / Less Info on info.html ---
        const moreInfoToggleBtn = document.getElementById('more-info-toggle');
        const togglableContentElements = document.querySelectorAll('.togglable-content');

        if (moreInfoToggleBtn && togglableContentElements.length > 0) {
            moreInfoToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('show-more-info');
                if (document.body.classList.contains('show-more-info')) {
                    moreInfoToggleBtn.textContent = 'Less Info';
                } else {
                    moreInfoToggleBtn.textContent = 'More Info';
                }
            });
        }
    }

    // État local pour la langue du SPA
    let currentLang = 'fr';
    let currentProjectData = null;

    // --- GESTION DU PROJET OVERLAY (SPA) ---

    const projects = {
        agence_dici: {
            title: 'AGENCE DICI',
            desc_fr: 'Visual identity design for an independent real estate agency. A global project blending spatial design, furniture, photography, and advertising communication. Dec.2025',
            desc_en: 'Visual identity design for an independent real estate agency. A global project blending spatial design, furniture, photography, and advertising communication. Dec.2025',
            assets: [
                'projets/dici/dici_images-01.webp',
                'projets/dici/dici_images-02.webp',
                'projets/dici/dici_images-03.webp',
                'projets/dici/dici_images-04.webp',
                'projets/dici/dici_images-05.webp',
                'projets/dici/dici_images-06.webp',
                'projets/dici/dici_images-07.webp',
                'projets/dici/dici_homepage.gif'
            ]
        },
        the_culture_evolves: {
            title: 'THE CULTURE EVOLVES',
            desc_fr: 'Creation of a visual narrative and motion design for a cultural institution. An art direction designed to translate museum discourse into a contemporary language. Feb.2025',
            desc_en: 'Creation of a visual narrative and motion design for a cultural institution. An art direction designed to translate museum discourse into a contemporary language. Feb.2025',
            assets: [
                'projets/motion%20culture/culture%20evolves_low.mp4',
                'projets/motion%20culture/printculture.webp',
                'projets/motion%20culture/museum.webp',
                'projets/motion%20culture/ticketculture.webp'
            ]
        },
        keblack: {
            title: 'KEBLACK',
            desc_fr: 'Visual identity created for a French-Congolese music label centered on typographic work inspired by a traditional mask. Research on the sign, logo, and letter design. Jan.2026',
            desc_en: 'Visual identity created for a French-Congolese music label centered on typographic work inspired by a traditional mask. Research on the sign, logo, and letter design. Jan.2026',
            assets: [
                'projets/keblack/keblack_post_0-01.webp',
                'projets/keblack/keblack_post_0-02.webp',
                'projets/keblack/keblack_post_0-03.webp',
                'projets/keblack/keblack_post_0-04.webp',
                'projets/keblack/keblack_post_0-05.webp',
                'projets/keblack/keblack_post_0-06.webp',
                'projets/keblack/keblack_post_0-07.webp'
            ]
        },
        cop1: {
            title: 'COP1',
            desc_fr: 'Advertising film developed within the Ici Barbès agency. Art direction, photography, and graphic design in collaboration with the copywriter. Sep.2025',
            desc_en: 'Advertising film developed within the Ici Barbès agency. Art direction, photography, and graphic design in collaboration with the copywriter. Sep.2025',
            assets: [
                'projets/cop1/cop1_05.webp',
                'projets/cop1/COP1_video.mp4',
                'projets/cop1/cop1_01.webp',
                'projets/cop1/cop1_04.webp'
            ]
        },
        sinequanon: {
            title: 'SINEQUANON',
            desc_fr: 'Immersive journey created for a solidarity race in partnership with Nike Run in Paris. Art direction combining installation, photography, and large-format printing at Place de la République. Mar.2025',
            desc_en: 'Immersive journey created for a solidarity race in partnership with Nike Run in Paris. Art direction combining installation, photography, and large-format printing at Place de la République. Mar.2025',
            assets: [
                'projets/sinequanon/visuel_03.webp',
                'projets/sinequanon/visuel_01.gif',
                'projets/sinequanon/visuel_02.webp',
                'projets/sinequanon/visuel_04.webp',
                'projets/sinequanon/visuel_05.webp',
                'projets/sinequanon/visuel_06.webp'
            ]
        },
        memoire: {
            title: 'MÉMOIRE',
            desc_fr: 'Identity magazine about fashion and cultural appropriation. Combining writing, editing, and interviews, this thesis questions contemporary visual narratives. Sep.2024',
            desc_en: 'Identity magazine about fashion and cultural appropriation. Combining writing, editing, and interviews, this thesis questions contemporary visual narratives. Sep.2024',
            assets: [
                'projets/memoire/memoire_post_09.webp',
                'projets/memoire/memoire_post_02.webp',
                'projets/memoire/memoire_post_03.webp',
                'projets/memoire/memoire_post_04.webp',
                'projets/memoire/memoire_post_10.gif',
                'projets/memoire/memoire_post_05.webp',
                'projets/memoire/memoire_post_06.webp',
                'projets/memoire/memoire_post_07.webp',
                'projets/memoire/memoire_post_08.webp'
            ]
        },
        sunburn: {
            title: 'SUNBURN',
            desc_fr: 'Artistic collaboration with designer Nino for an experimental music video. Combining photography, video, and visual design, the project draws its inspiration from Thailand. Mar.2026',
            desc_en: 'Artistic collaboration with designer Nino for an experimental music video. Combining photography, video, and visual design, the project draws its inspiration from Thailand. Mar.2026',
            assets: [
                'projets/sunburn/visuel_01.webp',
                'projets/sunburn/visuel_06.webp',
                'projets/sunburn/visuel_02.mp4',
                'projets/sunburn/visuel_07.webp'
            ]
        },
        creolisation: {
            title: 'CRÉOLISATION',
            desc_fr: 'Artistic installation centered on creolization presented in a museum space in collaboration with the Musée de l\'histoire de l\'immigration in Paris. A project blending scenography, photography, object creation, and plastic research. Oct.2025',
            desc_en: 'Artistic installation centered on creolization presented in a museum space in collaboration with the Musée de l\'histoire de l\'immigration in Paris. A project blending scenography, photography, object creation, and plastic research. Oct.2025',
            assets: [
                'projets/pfe/visuel_01.webp',
                'projets/pfe/visuel_02.webp',
                'projets/pfe/visuel_03.webp',
                'projets/pfe/visuel_11.webp',
                'projets/pfe/visuel_04.webp',
                'projets/pfe/visuel_05.gif',
                'projets/pfe/visuel_06.webp',
                'projets/pfe/visuel_07.webp',
                'projets/pfe/visuel_09.webp',
                'projets/pfe/visuel_10.webp'
            ]
        },
        tha: {
            title: 'THA',
            desc_fr: 'Creation of the identity for a Thai cosmetic brand. Global art direction including photography, packaging, and digital design. Apr.2026',
            desc_en: 'Creation of the identity for a Thai cosmetic brand. Global art direction including photography, packaging, and digital design. Apr.2026',
            assets: [
                'projets/tha/visuel_01.webp',
                'projets/tha/visuel_02.webp',
                'projets/tha/visuel_03.webp',
                'projets/tha/visuel_04_low.mp4',
                'projets/tha/visuel_05.webp',
                'projets/tha/visuel_06.gif',
                'projets/tha/visuel_07.webp'
            ]
        },
        andersson_bell: {
            title: "ANDERSSON BELL",
            desc_fr: "Personal project around the creation of a showroom blending space, visual narrative, and scenography. Art direction inspired by the dialogue between Scandinavian design and South Korean aesthetics. May.2026",
            desc_en: "Personal project around the creation of a showroom blending space, visual narrative, and scenography. Art direction inspired by the dialogue between Scandinavian design and South Korean aesthetics. May.2026",
            assets: [
                'projets/adsb/adsb01.webp',
                'projets/adsb/adsb02.webp',
                'projets/adsb/adsb03.webp',
                'projets/adsb/adsb04.webp',
                'projets/adsb/adsb05.webp',
                'projets/adsb/adsb06.webp',
                'projets/adsb/adsb07.webp',
                'projets/adsb/adsb08.webp',
                'projets/adsb/adsb09.mp4',
                'projets/adsb/adsb10.webp'
            ]
        },
        osaka: {
            title: 'OSAKA',
            desc_fr: 'Photographic series taken in Japan, exploring the street scenes and urban atmosphere of Osaka. A documentary look at daily life and Japanese aesthetics. May.2026',
            desc_en: 'Photographic series taken in Japan, exploring the street scenes and urban atmosphere of Osaka. A documentary look at daily life and Japanese aesthetics. May.2026',
            assets: [
                'projets/japon/street01.webp',
                'projets/japon/street02.webp',
                'projets/japon/street03.webp',
                'projets/japon/street04.webp',
                'projets/japon/street05.webp',
                'projets/japon/street06.webp',
                'projets/japon/street07.webp'
            ]
        },
        default: {
            title: 'BRANDING PROJECT',
            desc_fr: 'Upcoming project description. Graphic exploration and art direction.',
            desc_en: 'Upcoming project description. Graphic exploration and art direction.',
            assets: Array.from({ length: 8 }, (_, i) => `https://picsum.photos/${i % 2 === 0 ? 800 : 1200}/${i % 2 === 0 ? 1200 : 800}?random=default${i}`)
        }
    };

    const overlay = document.getElementById('project-overlay');
    const titleEl = overlay ? overlay.querySelector('.project-title') : null;
    const descEl = overlay ? overlay.querySelector('.project-description') : null;
    const galleryEl = overlay ? overlay.querySelector('.project-gallery-layer') : null;
    const closeBtn = overlay ? overlay.querySelector('.project-close-btn') : null;
    const langBtn = overlay ? overlay.querySelector('.project-lang-toggle') : null;
    const textLayer = overlay ? overlay.querySelector('.project-text-layer') : null;
    
    const videoOverlay = document.getElementById('video-overlay');
    const videoPlayer = document.getElementById('fullscreen-video');
    const videoCloseBtn = document.getElementById('video-close-btn');

    // --- INITIALISATION DES ÉVÉNEMENTS DE L'OVERLAY ---

    // Changement de langue
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            if (currentProjectData && descEl) {
                descEl.textContent = currentLang === 'fr' ? currentProjectData.desc_fr : currentProjectData.desc_en;
                preventWidows(descEl);
            }
        });
    }

    // Empêcher la fermeture de l'overlay quand on clique sur le bloc texte
    if (textLayer) {
        textLayer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeProject);
    }
function preventWidows(element) {
    if (!element) return;

    element.innerHTML = element.innerHTML.replace(
        /(\S+)\s+(\S+)\s*$/,
        '$1&nbsp;$2'
    );
}
    function openProject(projectTitle) {
        if (!overlay || !titleEl || !descEl || !galleryEl) return;

        // Normalisation : "AGENCE DICI" -> "agence_dici"
        // Ajout de .normalize et .replace pour gérer les accents (MÉMOIRE -> memoire)
        const key = projectTitle ? projectTitle.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, '_') : 'default';
        const data = projects[key] || projects['default'];
        currentProjectData = data;

        // Injecter le texte
titleEl.textContent = data.title;
descEl.textContent = currentLang === 'fr'
    ? data.desc_fr
    : data.desc_en;

// Empêche le dernier mot de passer seul à la ligne
preventWidows(titleEl);
preventWidows(descEl);

        // Vider la galerie et la remplir avec les images du projet cliqué
        galleryEl.innerHTML = '';
        if (data.assets && Array.isArray(data.assets)) {
            data.assets.forEach((imageUrl, index) => {
                const isVideoAsset = imageUrl.toLowerCase().endsWith('.mp4');
                const isGifTrigger = imageUrl.toLowerCase().endsWith('.gif') && data.video; // GIF qui déclenche un overlay vidéo séparé
                let element;

                if (isVideoAsset) {
                    element = document.createElement('video');
                    element.src = imageUrl.replace(/^PROG\//, '');
                    element.alt = `${data.title} - Video ${index + 1}`; // Texte alternatif pour l'accessibilité
                    element.className = 'project-gallery-img'; // Réutilise la classe CSS des images pour le style
                    element.controls = true; // Affiche les contrôles de lecture/pause
                    element.autoplay = true; // Lecture automatique
                    element.loop = true; // Lecture en boucle
                    element.muted = true; // Essentiel pour l'autoplay sur la plupart des navigateurs et mobiles
                    element.playsInline = true; // Permet la lecture en ligne sur iOS
                    element.preload = 'metadata'; // Optimise le chargement en ne chargeant que les métadonnées
                } else {
                    element = document.createElement('img');
                    element.src = imageUrl.replace(/^PROG\//, '');
                    element.alt = `${data.title} - Image ${index + 1}`;
                    element.className = 'project-gallery-img';
                }

                // Interaction dynamique pour les GIFs liés à une vidéo
                if (isGifTrigger) {
                    element.style.cursor = 'none'; 

                    // Clic pour ouvrir la vidéo
                    element.addEventListener('click', () => {
                        if (data.video) {
                            openVideoPlayer(data.video);
                        }
                    });

                    // Hover PLAY
                    element.addEventListener('mouseenter', () => {
                        const cursor = document.querySelector('.cursor-follower');
                        if (cursor) {
                            cursor.textContent = 'PLAY';
                            cursor.classList.add('active', 'play-mode');
                        }
                    });
                    element.addEventListener('mouseleave', () => {
                        const cursor = document.querySelector('.cursor-follower');
                        if (cursor) {
                            cursor.textContent = '';
                            cursor.classList.remove('active', 'play-mode');
                        }
                    });
                }

                galleryEl.appendChild(element);
            });
        }
 // Ajout du second bouton CLOSE à la fin de la galerie (flux du scroll)
        const bottomCloseBtn = document.createElement('button');
        bottomCloseBtn.className = 'project-close-btn project-close-btn-bottom';
        bottomCloseBtn.textContent = 'CLOSE';
        bottomCloseBtn.addEventListener('click', (e) => { e.preventDefault(); closeProject(); });
        galleryEl.appendChild(bottomCloseBtn);
        // Activer l'overlay et les styles globaux
        overlay.classList.add('active');
        document.body.classList.add('project-open');
    }

    // --- GESTION VIDEO PLAYER ---
    function openVideoPlayer(videoSrc) {
        if (!videoOverlay || !videoPlayer) return;
        
        // Injecter la source et lancer la lecture
        videoPlayer.src = videoSrc;
        history.pushState({ videoOpen: true }, ''); // Permet le history.back()
        videoOverlay.classList.add('active');
        videoPlayer.play();
    }

    function closeVideoPlayer() {
        if (!videoOverlay || !videoPlayer) return;

        videoOverlay.classList.remove('active');
        videoPlayer.pause();
        videoPlayer.src = ''; // Vide la source pour libérer la mémoire
        videoPlayer.load();
    }

    function closeProject() {
        if (!overlay) return;

        overlay.classList.remove('active');
        document.body.classList.remove('project-open');
        // Nettoyage optionnel après transition
        setTimeout(() => {
            galleryEl.innerHTML = '';
        }, 400);
    }

    // Écouteurs d'événements délégués pour les projets (y compris les clones)
    document.addEventListener('click', (e) => {
        const projectItem = e.target.closest('.project-item');
        if (projectItem) {
            const title = projectItem.getAttribute('data-title');
            
            // Transition fluide spécifique mobile : on laisse le temps de voir le changement de couleur
            if (window.matchMedia("(max-width: 768px)").matches) {
                // On active visuellement l'item (couleur + scale)
                projectItem.classList.add('item-tapping');
                
                // Délai synchronisé avec la transition CSS (0.4s) pour un rendu fluide
                setTimeout(() => {
                    openProject(title);
                    projectItem.classList.remove('item-tapping');
                }, 450);
            } else {
                openProject(title);
            }
        }
    });

    // Fermer le projet au clic n'importe où sur l'overlay (Desktop uniquement)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) return;

            // Si le clic est dans le bloc texte (ou ses enfants), on ne ferme pas
            if (e.target.closest('.project-text-layer')) return;

            closeProject();
        });
    }

    // Bouton Close de la vidéo : history.back()
    if (videoCloseBtn) {
        videoCloseBtn.addEventListener('click', () => {
            history.back();
        });
    }

    window.addEventListener('popstate', () => {
        closeVideoPlayer();
    });
});
