/**
 * @fileOverview Openinsametab options script
 * @name options.js
 * @author tukapiyo <webmaster@filewo.net>
 * @license Mozilla Public License, version 2.0
 */

function localization()
{
    document.querySelectorAll('[data-string]').forEach(function(el) {
        el.textContent = browser.i18n.getMessage(el.dataset.string);
    });
}

async function loadConfig()
{
    const config = await browser.storage.local.get();
    document.querySelectorAll('input').forEach(function (el) {
        const id = el.id;
        switch (el.type) {
        case 'checkbox':
            el.checked = config[id];
            break;
        default:
            el.value = config[id];
        }
    });
}

// init
localization();
loadConfig();

document.getElementById('enable_shortcut').addEventListener('change', async function() {

    // checked
    if (this.checked) {
        const result_perm = await browser.permissions.request({ origins : ["<all_urls>"] });

        // permission granted
        if (result_perm)
            await browser.storage.local.set({ 'enable_shortcut' : true });
        // permission denied
        else
            this.checked = false;
    }
    else {
        await browser.storage.local.set({ 'enable_shortcut' : false });
        browser.permissions.remove({ origins : ["<all_urls>"] });
    }

});

