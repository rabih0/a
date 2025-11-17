document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const welcomeMessage = document.getElementById('welcome-message');
    let step = 0;
    const userData = {};

    function clearContent() {
        appContent.innerHTML = '';
    }

    function renderIntro() {
        clearContent();
        const core = document.createElement('div');
        core.className = 'interactive-core';
        core.id = 'start-core';
        
        const aiText = document.createElement('p');
        aiText.className = 'ai-text';
        aiText.textContent = 'Guten Tag. Ich bin Ihr Umzugs-Assistent.';

        appContent.appendChild(aiText);
        appContent.appendChild(core);

        core.addEventListener('click', () => {
            welcomeMessage.style.display = 'none'; // Hide welcome message
            step = 1;
            renderAddressStep();
        });
    }

    function renderAddressStep() {
        clearContent();
        const aiText = document.createElement('p');
        aiText.className = 'ai-text';
        aiText.textContent = 'Beginnen wir mit den Adressen. (PLZ)';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'glass-input';
        input.placeholder = 'z.B. 20535 nach 22301';
        
        const chipContainer = document.createElement('div');
        chipContainer.className = 'chip-container';

        appContent.appendChild(aiText);
        appContent.appendChild(input);
        appContent.appendChild(chipContainer);

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                const matches = this.value.match(/(\d{5}).*?(\d{5})/);
                if (matches) {
                    userData.startPLZ = matches[1];
                    userData.endPLZ = matches[2];
                    chipContainer.innerHTML = `
                        <div class="chip">Start: ${userData.startPLZ}</div>
                        <div class="chip">Ziel: ${userData.endPLZ}</div>
                    `;
                    setTimeout(() => {
                        step = 2;
                        renderSizeStep();
                    }, 1000);
                }
            }
        });
    }

    function renderSizeStep() {
        clearContent();
        const aiText = document.createElement('p');
        aiText.className = 'ai-text';
        aiText.textContent = 'Verstanden. Nun zum Umfang. (z.B. 80m², 2. Stock)';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'glass-input';
        input.placeholder = 'z.B. 80m2 2.og ohne aufzug';

        const chipContainer = document.createElement('div');
        chipContainer.className = 'chip-container';

        appContent.appendChild(aiText);
        appContent.appendChild(input);
        appContent.appendChild(chipContainer);

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                const m2Match = this.value.match(/(\d+)\s*m/);
                const etageMatch = this.value.match(/(\d+)\.\s*o/);
                const aufzugMatch = /ohne aufzug|kein aufzug/i.test(this.value);

                userData.m2 = m2Match ? m2Match[1] : 'N/A';
                userData.etage = etageMatch ? etageMatch[1] : 'N/A';
                userData.aufzug = aufzugMatch ? 'Nein' : 'Ja';

                chipContainer.innerHTML = `
                    <div class="chip">Fläche: ${userData.m2}m²</div>
                    <div class="chip">Etage: ${userData.etage}. OG</div>
                    <div class="chip">Aufzug: ${userData.aufzug}</div>
                `;
                setTimeout(() => {
                    step = 3;
                    renderServicesStep();
                }, 1000);
            }
        });
    }

    function renderServicesStep() {
        clearContent();
        userData.services = [];
        const aiText = document.createElement('p');
        aiText.className = 'ai-text';
        aiText.textContent = 'Wählen Sie Ihre Services.';

        const serviceMatrix = document.createElement('div');
        serviceMatrix.className = 'service-matrix';
        const services = ['Nur Transport', 'Möbelmontage', 'Küchenmontage', 'Einpackservice'];
        
        services.forEach(serviceName => {
            const button = document.createElement('button');
            button.className = 'hologram-button';
            button.textContent = serviceName;
            button.addEventListener('click', () => {
                button.classList.toggle('selected');
                if (button.classList.contains('selected')) {
                    userData.services.push(serviceName);
                } else {
                    userData.services = userData.services.filter(s => s !== serviceName);
                }
            });
            serviceMatrix.appendChild(button);
        });
        
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Angebot berechnen';
        nextButton.className = 'hologram-button';
        nextButton.style.marginTop = '20px';
        nextButton.style.borderColor = 'var(--primary-color)';


        appContent.appendChild(aiText);
        appContent.appendChild(serviceMatrix);
        appContent.appendChild(nextButton);

        nextButton.addEventListener('click', () => {
            step = 4;
            renderQuoteStep();
        });
    }

    function renderQuoteStep() {
        clearContent();
        const aiText = document.createElement('p');
        aiText.className = 'ai-text';
        aiText.textContent = '[KI kalibriert...]';
        appContent.appendChild(aiText);

        // Simulate AI calculation
        setTimeout(() => {
            const basePrice = 500;
            const m2Price = (parseInt(userData.m2) || 50) * 2;
            const etagePrice = (parseInt(userData.etage) || 1) * 50;
            const aufzugPrice = userData.aufzug === 'Nein' ? 100 : 0;
            const servicesPrice = userData.services.length * 75;
            
            const finalPrice = basePrice + m2Price + etagePrice + aufzugPrice + servicesPrice;
            const priceMin = Math.round(finalPrice * 0.9 / 10) * 10;
            const priceMax = Math.round(finalPrice * 1.1 / 10) * 10;
            
            userData.priceMin = priceMin;
            userData.priceMax = priceMax;

            renderQuoteCard();
        }, 2000);
    }

    function renderQuoteCard() {
        clearContent();
        const quoteCard = document.createElement('div');
        quoteCard.className = 'quote-card';

        quoteCard.innerHTML = `
            <h3>Ihr Sofort-Angebot:</h3>
            <p>€ ${userData.priceMin} - ${userData.priceMax}</p>
            <div class="action-icons">
                <svg id="copy-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
                <svg id="share-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path></svg>
            </div>
        `;
        appContent.appendChild(quoteCard);

        document.getElementById('copy-icon').addEventListener('click', copyQuote);
        document.getElementById('share-icon').addEventListener('click', expandForPdf);
    }

    function expandForPdf() {
        const quoteCard = document.querySelector('.quote-card');
        const existingExpansion = quoteCard.querySelector('.pdf-expansion');
        if (existingExpansion) {
            existingExpansion.remove();
            return;
        }

        const expansionDiv = document.createElement('div');
        expansionDiv.className = 'pdf-expansion';
        expansionDiv.style.marginTop = '20px';
        expansionDiv.style.animation = 'fadeIn 0.5s';

        expansionDiv.innerHTML = `
            <input type="text" class="glass-input" placeholder="Name (Optional)" id="pdf-name" style="margin-bottom: 10px;">
            <input type="email" class="glass-input" placeholder="E-Mail (Optional)" id="pdf-email" style="margin-bottom: 20px;">
            <button id="send-pdf-btn" class="hologram-button">PDF Senden</button>
        `;

        quoteCard.appendChild(expansionDiv);

        document.getElementById('send-pdf-btn').addEventListener('click', () => {
            const name = document.getElementById('pdf-name').value;
            const email = document.getElementById('pdf-email').value;
            alert(`Simulierte PDF-Erstellung.
Name: ${name || 'Nicht angegeben'}
E-Mail: ${email || 'Nicht angegeben'}
Das PDF würde an ${email || 'die angegebene Adresse'} gesendet.`);
            expansionDiv.remove();
        });
    }


    function copyQuote() {
        const summary = `Umzugsangebot:
Start: ${userData.startPLZ}
Ziel: ${userData.endPLZ}
Fläche: ${userData.m2}m²
Etage: ${userData.etage}. OG
Aufzug: ${userData.aufzug}
Services: ${userData.services.join(', ') || 'Keine'}
Geschätzter Preis: € ${userData.priceMin} - ${userData.priceMax}`;
        
        navigator.clipboard.writeText(summary).then(() => {
            alert('Angebot in die Zwischenablage kopiert!');
        }).catch(err => {
            alert('Fehler beim Kopieren.');
            console.error('Copy failed', err);
        });
    }

    // Start the app
    renderIntro();
});
