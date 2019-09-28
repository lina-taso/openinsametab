/**
 * @fileOverview Openinsametab background script
 * @name openinsametab-background.js
 * @author tukapiyo <webmaster@filewo.net>
 * @license Mozilla Public License, version 2.0
 */

browser.runtime.onStartup.addListener(startup);
browser.runtime.onInstalled.addListener(install);
browser.runtime.onMessage.addListener(message);
browser.storage.onChanged.addListener(change);

const firstrun_url = 'https://www2.filewo.net/wordpress/category/open-not-in-new-tab/';
let registered_content_script;

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

// from content scripts
function message(message, sender)
{
    browser.tabs.update(
        sender.tab.id,
        message
    );
}

async function change(changes, area)
{
    if (area != 'local') return;
    const keys = Object.keys(changes);

    for (let key of keys) {
        switch (key) {
        case 'enable_shortcut':
            // chacked
            if (changes[key].newValue === true) {
                registered_content_script = await browser.contentScripts.register({
                    allFrames : true,
                    matches : ["<all_urls>"],
                    js : [{file : "/scripts/openinsametab-content.js"}]
                });
                console.log(registered_content_script);
            }
            // unchecked
            else {
                registered_content_script.unregister();
            }

            break;
        }
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
