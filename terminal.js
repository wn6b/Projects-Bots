// js/modules/terminal.js
export const WanoTerminal = {
    init(elementId) {
        const terminal = document.getElementById(elementId);
        const commands = [
            "> Initializing Wano Protocol...",
            "> Connecting to Satellite Uplink...",
            "> Quantum Encryption: ACTIVE",
            "> System Status: OPTIMAL"
        ];
        let i = 0;
        setInterval(() => {
            if(i < commands.length) {
                const p = document.createElement('p');
                p.innerText = commands[i];
                p.style.color = "#00ffcc";
                terminal.appendChild(p);
                i++;
            }
        }, 1000);
    }
};
