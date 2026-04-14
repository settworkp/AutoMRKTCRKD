const puppeteer = require('puppeteer-core');

const MESSAGE = '**💎🚀📈 ＳＩＧＮＡＴＵＲＥ　ＳＰＯＴ　ＦＯＲ　ＳＡＬＥ / ＧＲＯＷ　ＹＯＵＲ　ＢＵＳＩＮＥＳＳ　ＮＯＷ 📈🚀💎** https://cracked.ax/Thread-SIGNATURE-SPOTS-FOR-SALE--1901057';

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

(async () => {
    const cookiesJson = process.env.COOKIES_JSON;
    if (!cookiesJson) {
        console.error('❌ COOKIES_JSON manquant');
        process.exit(1);
    }

    const cookies = JSON.parse(cookiesJson);

    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXEC_PATH || '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        headless: true
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    page.setDefaultNavigationTimeout(120000);
    page.setDefaultTimeout(120000);

    try {
        console.log('🚀 Démarrage du bot...');

        // ÉTAPE 1 — Charger cracked.ax + attendre 20s
        console.log('🌐 Navigation vers cracked.ax...');
        await page.goto('https://cracked.ax', { waitUntil: 'domcontentloaded', timeout: 120000 });
        console.log('✅ Page chargée. Attente 20s...');
        await sleep(20 * 1000);

        // ÉTAPE 2 — Injecter cookies + attendre 20s
        console.log('🍪 Injection des cookies...');
        for (const cookie of cookies) {
            const c = { ...cookie };
            if (c.domain) c.domain = c.domain.replace('cracked.ax', 'cracked.ax');
            delete c.storeId;
            delete c.hostOnly;
            try { await page.setCookie(c); } catch(e) {}
        }
        console.log('✅ Cookies injectés. Attente 20s...');
        await sleep(20 * 1000);

        // ÉTAPE 3 — Reload en connecté
        console.log('🔄 Rechargement de la page...');
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
        console.log('✅ Page rechargée.');

        // Screenshot après login
        await page.screenshot({ path: 'screenshot_login.png', fullPage: false });
        console.log('📸 Screenshot login sauvegardé');

        // ÉTAPE 4 — 10s puis cliquer Marketplace
        console.log('⏳ Attente 10s avant Marketplace...');
        await sleep(10 * 1000);

        console.log('🛒 Clic sur Marketplace...');
        try {
            await page.evaluate(() => {
                let btn = document.evaluate(
                    "//*[@id='shoutbox']/div[1]/ul/li[2]/a/span",
                    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue;
                if (btn) { btn.click(); return; }
                const links = document.querySelectorAll('#shoutbox ul li a');
                for (const link of links) {
                    if (link.textContent.trim().toLowerCase().includes('marketplace')) {
                        link.click(); return;
                    }
                }
            });
            console.log('✅ Marketplace cliqué');
        } catch(e) {
            console.log('⚠️ Marketplace introuvable, on continue...');
        }

        // ÉTAPE 5 — 5s puis coller le message
        console.log('⏳ Attente 5s avant collage...');
        await sleep(5 * 1000);

        // Screenshot avant envoi
        await page.screenshot({ path: 'screenshot_marketplace.png', fullPage: false });
        console.log('📸 Screenshot marketplace sauvegardé');

        console.log('✍️ Collage du message...');
        const chatBox = await page.$('#message_input');
        if (!chatBox) {
            console.error('❌ Champ message_input introuvable');
            await page.screenshot({ path: 'screenshot_error.png' });
            await browser.close();
            process.exit(1);
        }

        await chatBox.click({ clickCount: 3 });
        await chatBox.press('Backspace');
        await chatBox.type(MESSAGE, { delay: 30 });
        console.log('✅ Message collé');

        // Screenshot après collage
        await page.screenshot({ path: 'screenshot_typed.png', fullPage: false });
        console.log('📸 Screenshot après collage');

        // ÉTAPE 6 — 3s puis envoyer
        console.log('⏳ Attente 3s avant envoi...');
        await sleep(3 * 1000);

        console.log('📩 Envoi du message...');
        const sendBtn = await page.$('#send_message');
        if (sendBtn) {
            await sendBtn.click();
            console.log('✅ Bouton send_message cliqué');
        } else {
            await chatBox.press('Enter');
            console.log('✅ Touche Entrée pressée');
        }

        // ÉTAPE 7 — 3s puis screenshot final + fermer
        console.log('⏳ Attente 3s avant fermeture...');
        await sleep(3 * 1000);

        await page.screenshot({ path: 'screenshot_final.png', fullPage: false });
        console.log('📸 Screenshot final sauvegardé');
        console.log('👋 Fermeture du navigateur');

    } catch (err) {
        console.error('❌ Erreur:', err.message);
        await page.screenshot({ path: 'screenshot_error.png' }).catch(() => {});
        await browser.close();
        process.exit(1);
    }

    await browser.close();
    console.log('✅ Bot terminé avec succès');
})();
