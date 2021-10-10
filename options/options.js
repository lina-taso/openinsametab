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
        case 'radio':
            if (el.id === 'disable_shortcut') break;
            el.checked = config[id] === true;
            break;
        default:
            el.value = config[id];
        }
    });
}

// init
localization();
loadConfig();

document.getElementsByName('enable_option').forEach((e) => { e.addEventListener('change', async function() {
    // checked
    switch (this.id) {
    case 'disable_shortcut':
        browser.permissions.remove({ origins : ["<all_urls>"] });
        await browser.storage.local.set({ 'enable_shortcut' : false, 'enable_allclick' : false });
        break;
    case 'enable_shortcut':
    case 'enable_allclick':
        const result_perm = await browser.permissions.request({ origins : ["<all_urls>"] });
        // permission granted
        if (result_perm) {
            await browser.storage.local.set({ 'enable_shortcut' : this.id === 'enable_shortcut',
                                              'enable_allclick' : this.id === 'enable_allclick' });
        }
        // permission denied
        else
            document.getElementById('disable_shortcut').checked = true;
        break;
    }
})});
