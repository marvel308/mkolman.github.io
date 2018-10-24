---
layout: page
permalink: /hlp
decrypt: yes
---
<center id="youtubeWrapper">
    <iframe style="width: 560px; height: 315px; max-width: 100%" id="youtubeIFrame" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    <br/>
    <b id="text"></b>
</center>

<script type="text/javascript">
    YOUTUBE_LINK = "https://www.youtube-nocookie.com/embed/{}?controls=0&autoplay=1";
    DATA = {
        "5": "U2FsdGVkX1/H8BfcL7p4XYzW8SR9VWbTeuaBc4OePyQVAGIrmAPqRmJ7tkRNhopYummG3udEnhyGkpgg5uKH/ktMQpfJg5a/xj51CcygEyA5kRtOwZACheCB4Z/kVobVTKd42D1gk5UVF2XyVQcg+1bZN0spoTNA62Z71f7iXqlf6pfwU0JTCj52syUkGbGI"
    }
    function show() {
        let urlParams = new URLSearchParams(window.location.search);
        let task = urlParams.get("t");
        let key = urlParams.get("k");
        let enc_data = CryptoJS.AES.decrypt(DATA[task], key);
        let task_data = JSON.parse(enc_data.toString(CryptoJS.enc.Utf8));
        let iframe = document.getElementById("youtubeIFrame");
        iframe.src = YOUTUBE_LINK.replace("{}", task_data.id);
        let text = document.getElementById("text");
        text.innerHTML = task_data.msg;
    }
    document.addEventListener( "DOMContentLoaded", show, false );
</script>
