---
layout: page
title: Curriculum vitae
permalink: /cv/
---

You can download my CV, however only an
[obfuscated version]({{"assets/docs/maks_kolman_redacted_cv.pdf"|relative_url}})
is available to the public. If you have the password or want to try and guess it you can
[decrypt the full CV]({{"assets/docs/maks_kolman_full_cv.pdf.aes"|relative_url}}){:.decrypt}{:download="maks_kolman_full_cv.pdf"}.

<!-- * [2018-$now] Software developer @ [Google search](https://www.google.com) \| [SRE](https://landing.google.com/sre/) -->
* [2017-2018] Software developer @ [Bitstamp](https://bitstamp.net)
* [2015-2018] Master's student of computational physics @ [Faculty of mathematics and physics](http://www.fmf.uni-lj.si) \| [University of Ljubljana](http://www.uni-lj.si)
* [2015-2018] Student researcher @ [The Parallel and Distributed Systems Laboratory](http://e6.ijs.si) \| [Jožef Stefan Institute](http://www.ijs.si)
* [2016-2018] Programming teacher @ [Programming club](http://prog.gimvic.org) \| [Gimnazija Vič](http://www.gimvic.org)

<script type="text/javascript">
    function getAesEncFile(uri, passcode, callback) {
        // Download a file encrypted with AES e.g.
        // openssl-1.0 aes-256-cbc -in original.pdf -out encrypted.pdf.aes -k passcode -base64
        if (!passcode) {
           passcode = prompt("Enter AES encryption key:");
        }
        if (passcode) {
            $.get(uri, function(data) {
                // For some reason openssl pushes new lines every 64 chars
                data = data.split(/\s/).join('');
                // Decrypt
                let decrypted = CryptoJS.AES.decrypt(data, passcode);
                callback(decrypted);
            });
        }
    }

    $(".decrypt").click(function(event){
        event.preventDefault();
        let target = $(event.target);
        target.unbind('click');
        getAesEncFile(target.attr("href"), null, function (decrypted) {
            target.html(target.html().replace("decrypt", "<del>decrypt</del> download"));
            target.attr("href", "data:application/pdf;base64, " + decrypted.toString(CryptoJS.enc.Base64));
        });
    });
</script>
