// (C) 2018 @xmcp. THIS PROJECT IS LICENSED UNDER GPL VERSION 3. SEE `LICENSE.txt`.

// https://stackoverflow.com/questions/3086068/how-do-i-check-whether-a-jquery-element-is-in-the-dom
if(typeof root_elem=='undefined' || !root_elem.closest('html')) {
    var root_elem=null;
    var root_document=null;
}

function make_p(s) {
    var elem=document.createElement('p');
    elem.textContent=s;
    return elem;
}
function make_a(s,u) {
    var elem=document.createElement('a');
    elem.href=u;
    elem.target='_blank';
    elem.textContent=s;
    return elem;
}
function make_elem(tagname,classname) {
    var elem=document.createElement(tagname);
    elem.className=classname;
    return elem;
}

function proc_mode(mode) {
    switch(parseInt(mode)) {
        case 1: return '|←';
        // 2,3: ???
        case 4: return '↓↓';
        case 5: return '↑↑';
        case 6: return 'R→';
        case 7: return '**';
        case 8: return '[CODE]';
        case 9: return '[BAS]';
        default: return '[MODE'+mode+']';
    }
}

function proc_rgb(x) {
    return [
        Math.floor(x/256/256),
        Math.floor(x/256)%256,
        x%256
    ];
}
function get_L(r,g,b) {
    // var ma=Math.max(r,g,b), mi=Math.min(r,g,b);
    // return (ma+mi)/2/256;
    return (r+g+b)/3/256;
}

function _fix2(a) {
    return a<10 ? '0'+a : ''+a;
}
function format_date(x) {
    return _fix2(x.getFullYear()%100)+'/'+(x.getMonth()+1)+'/'+x.getDate();
}
function format_datetime(x) {
    return format_date(x)+' '+x.getHours()+':'+_fix2(x.getMinutes());
}

function zero_array(len) {
    var x=new Array(len);
    for(var i=0;i<len;i++) x[i]=0;
    return x;
}

function parse_time(time) { // MMMMMM:SS -> seconds
    var res=/(\d+)\:(\d{2})/.exec(time);
    return parseInt(res[1])*60+parseInt(res[2]);
}

// https://stackoverflow.com/questions/24025165/simulating-a-mousedown-click-mouseup-sequence-in-tampermonkey
function trigger_mouse_event(node, eventType) {
    var clickEvent=document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType,true,true);
    node.dispatchEvent(clickEvent);
}

function reload_danmaku_magic() {
    if(!root_elem) {
        console.log('pakku magic reload: root_elem not found');
        return;
    }
    var date_picker=root_elem.querySelector('.bilibili-player-danmaku-date-picker-day-content');

    if(!date_picker) {
        var history_btn=root_elem.querySelector('.bilibili-player-danmaku-btn-history');
        console.log('pakku magic reload: activating date picker with',history_btn);
        history_btn.click();
        history_btn.click();
        date_picker=root_elem.querySelector('.bilibili-player-danmaku-date-picker-day-content');
    }

    var elem=document.createElement('span');
    elem.className='js-action __pakku_injected';
    elem.dataset['action']='changeDay';
    elem.dataset['timestamp']=0;
    elem.style.display='none';
    date_picker.appendChild(elem);

    console.log('pakku magic reload: proceed');
    trigger_mouse_event(elem,'mousedown');
    trigger_mouse_event(elem,'mouseup');
    trigger_mouse_event(elem,'click');

    date_picker.removeChild(elem);
}

function inject_css(css) {
    var elem=document.createElement('style');
    elem.textContent=css;
    root_elem.appendChild(elem);
}