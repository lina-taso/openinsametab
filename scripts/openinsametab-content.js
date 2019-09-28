/**
 * @fileOverview Openinsametab content script
 * @name openinsametab-content.js
 * @author tukapiyo <webmaster@filewo.net>
 * @license Mozilla Public License, version 2.0
 */

document.addEventListener('click', function(e) {
    if (e.ctrlKey && e.shiftKey) {
        let el = e.target;
        while (el.tagName != 'HTML') {
            if (el.tagName == 'A' && el.href) {
                console.log(el);
                e.preventDefault();
                e.stopPropagation();
                browser.runtime.sendMessage({ url : el.href });
                break;
            }
            el = el.parentElement;
        }
    }
});
