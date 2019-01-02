/**
 * @fileOverview Openinsametab background script
 * @name openinsametab-background.js
 * @author tukapiyo <webmaster@filewo.net>
 * @license Mozilla Public License, version 2.0
 */

browser.runtime.onStartup.addListener(startup);
browser.runtime.onInstalled.addListener(install);

const firstrun_url = 'https://www2.filewo.net/wordpress/category/twit-side-addon/';

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
