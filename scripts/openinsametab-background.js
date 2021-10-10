/**
 * @fileOverview Openinsametab background script
 * @name openinsametab-background.js
 * @author tukapiyo <webmaster@filewo.net>
 * @license Mozilla Public License, version 2.0
 */

browser.runtime.onStartup.addListener(startup);
browser.runtime.onInstalled.addListener(install);
browser.storage.onChanged.addListener(change);

const firstrun_url = 'https://www2.filewo.net/wordpress/category/open-not-in-new-tab/';
var registered_content_script;

function startup()
{
}

function install(details)
{
    if (details.reason == 'install'
        || details.reason == 'update') {

        return browser.tabs.create({
            url : firstrun_url,
            active : true
        });
    }
    return Promise.resolve();
}

async function change(changes, area)
{
    if (area != 'local') return;
    const keys = Object.keys(changes);

    for (let key of keys) {
        switch (key) {
        case 'enable_shortcut':
        case 'enable_allclick':
            // checked
            if (changes[key].newValue === true && !registered_content_script) {
                registered_content_script = await browser.contentScripts.register({
                    allFrames : true,
                    matches : ["<all_urls>"],
                    js : [{ file : "/scripts/openinsametab-content.js" }]
                });
                console.log(registered_content_script);
            }
            else if (changes['enable_shortcut'].newValue === false && changes['enable_allclick'].newValue === false
                     && registered_content_script) {
                await registered_content_script.unregister();
                registered_content_script = undefined;
            }
        }
        break;
    }
}

browser.contextMenus.create({
    id : 'openinsametab-openlink',
    title : browser.i18n.getMessage('openlink'),
    contexts : [
        'link'
    ]
});
browser.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
    case 'openinsametab-openlink':
        browser.tabs.update(
            tab.id,
            { url : info.linkUrl }
        );
        break;
    }
});

browser.storage.local.get().then(async config => {
    // enable keyboard shortcuts at startup
    if (config['enable_shortcut'] === true || config['enable_allclick'] === true) {
        registered_content_script = await browser.contentScripts.register({
            allFrames : true,
            matches : ["<all_urls>"],
            js : [{ file : "/scripts/openinsametab-content.js" }]
        });
        console.log(registered_content_script);
    }
});
