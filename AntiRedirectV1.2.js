// ==UserScript==
// @name         Anti Redirect 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Prevents other Tampermonkey scripts from redirecting you to different websites.
// @author       spxia
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // DomainList
    var allowedDomains = [
        'example.com',
        'anotherexample.com'
        // Add more domains as needed
    ];

 
    function isAllowedDomain(url) {
        var hostname = new URL(url).hostname;
        for (var i = 0; i < allowedDomains.length; i++) {
            if (hostname.includes(allowedDomains[i])) {
                return true;
            }
        }
        return false;
    }


    var originalAssign = window.location.assign;
    window.location.assign = function(url) {
        if (isAllowedDomain(url)) {
            originalAssign.apply(this, arguments);
        } else {
            console.warn("Blocked redirect to:", url);
        }
    };

    // Override the window.location.href setter to prevent setting to forbidden URLs
    Object.defineProperty(window.location, 'href', {
        set: function(url) {
            if (isAllowedDomain(url)) {
                window.location.href = url;
            } else {
                console.warn("Blocked setting href to:", url);
            }
        }
    });
})();
