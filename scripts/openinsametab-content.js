/**
 * @fileOverview Openinsametab content script
 * @name openinsametab-content.js
 * @author tukapiyo <webmaster@filewo.net>
 * @license Mozilla Public License, version 2.0
 */

browser.storage.local.get().then((ret) => { config = ret });

const clickEvent = function(e) {
    if (config['enable_shortcut'] && e.ctrlKey && e.shiftKey
        || config['enable_allclick'] && !e.ctrlKey && !e.shiftKey) {
        let el = e.target;
        while (el.tagName != 'HTML') {
            if (el.tagName == 'A' && el.href) {
                e.preventDefault();
                e.stopPropagation();
                window.location = el.href;
                break;
            }
            el = el.parentElement;
        }
    }
    else if (config['enable_allclick'] && e.ctrlKey && e.shiftKey) {
        let el = e.target;
        while (el.tagName != 'HTML') {
            if (el.tagName == 'A' && el.href) {
                e.preventDefault();
                e.stopPropagation();
                document.removeEventListener('click', clickEvent);
                el.click();
                document.addEventListener('click', clickEvent);
            }
            el = el.parentElement;
        }
    }
};

document.addEventListener('click', clickEvent);
