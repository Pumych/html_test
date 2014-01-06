(function ($) {
    if (typeof $.fn.jCarouselLite == 'function')return;
    $.fn.jCarouselLite = function (o) {
        o = $.extend({btnPrev: null, btnNext: null, btnGo: null, externalControllerActiveClass: 'active', mouseWheel: false, auto: null, speed: 150, easing: null, vertical: false, circular: true, visible: 3, start: 0, scroll: 1, beforeStart: null, afterEnd: null, onMouseEnter: null, onMouseLeave: null, onHoverElements: null}, o || {});
        return this.each(function () {
            var running = false, animCss = o.vertical ? "top" : "left", sizeCss = o.vertical ? "height" : "width", _interval = null;
            var div = $(this), ul = $("ul", div), tLi = $("li", ul), tl = tLi.size(), v = o.visible, onHover = $(o.onHoverElements);
            if (o.circular) {
                ul.prepend(tLi.slice(tl - v - 1 + 1).clone()).append(tLi.slice(0, v).clone());
                o.start += v;
            }
            onHover.live('mouseenter mouseleave', function (event) {
                if (event.type == 'mouseenter') {
                    if (o.onMouseEnter)o.onMouseEnter.call(this, vis());
                    if (o.auto)clearInterval(_interval);
                    div.hovered = true;
                } else if (event.type == 'mouseleave') {
                    if (o.onMouseLeave)o.onMouseLeave.call(this, vis());
                    div.hovered = false;
                    if (o.auto) {
                        clearInterval(_interval);
                        _interval = setInterval(function () {
                            go(curr + o.scroll)
                        }, o.auto + o.speed);
                    }
                }
            });
            var li = $("li", ul), itemLength = li.size(), curr = o.start;
            div.css("visibility", "visible");
            li.css({overflow: "hidden", "float": o.vertical ? "none" : "left"});
            ul.css({margin: "0", padding: "0", position: "relative", "list-style-type": "none", "z-index": "1"});
            div.css({overflow: "hidden", position: "relative", "z-index": "2", left: "0px"});
            var liSize = o.vertical ? height(li) : width(li);
            var ulSize = liSize * itemLength;
            var divSize = liSize * v;
            li.css({width: li.width(), height: li.height()});
            ul.css(sizeCss, ulSize + "px").css(animCss, -(curr * liSize));
            div.css(sizeCss, divSize + "px");
            if (o.btnPrev)$(o.btnPrev).click(function () {
                div.navigated = true;
                return go(curr - o.scroll);
            });
            if (o.btnNext)$(o.btnNext).click(function () {
                div.navigated = true;
                return go(curr + o.scroll);
            });
            if (o.btnGo)$.each(o.btnGo, function (i, val) {
                $(val).click(function () {
                    div.navigated = true;
                    return go(o.circular ? o.visible + i : i);
                });
                $(o.btnGo[o.circular ? o.start - 1 : o.start].toString()).addClass(o.externalControllerActiveClass)
            });
            if (o.mouseWheel && div.mousewheel)div.mousewheel(function (e, d) {
                return d > 0 ? go(curr - o.scroll) : go(curr + o.scroll);
            });
            if (o.auto)_interval = setInterval(function () {
                if (!div.hovered)go(curr + o.scroll);
            }, o.auto + o.speed);
            function vis() {
                return li.slice(curr).slice(0, v);
            };
            function go(to) {
                if (!running) {
                    if (o.beforeStart)o.beforeStart.call(this, vis());
                    if (o.circular) {
                        if (to <= o.start - v - 1) {
                            ul.css(animCss, -((itemLength - (v * 2)) * liSize) + "px");
                            curr = to == o.start - v - 1 ? itemLength - (v * 2) - 1 : itemLength - (v * 2) - o.scroll;
                        } else if (to >= itemLength - v + 1) {
                            ul.css(animCss, -((v) * liSize) + "px");
                            curr = to == itemLength - v + 1 ? v + 1 : v + o.scroll;
                        } else curr = to;
                    } else {
                        if (to < 0 || to > itemLength - v)return; else curr = to;
                    }
                    running = true;
                    if (o.btnGo) {
                        _global_current = curr > tLi.length ? 0 : (o.circular ? curr - 1 : curr);
                        $.each(o.btnGo, function (i, val) {
                            if (i == _global_current) {
                                $(this.toString()).addClass(o.externalControllerActiveClass)
                            } else {
                                $(this.toString()).removeClass(o.externalControllerActiveClass)
                            }
                        })
                    }
                    ;
                    ul.animate(animCss == "left" ? {left: -(curr * liSize)} : {top: -(curr * liSize)}, o.speed, o.easing, function () {
                        if (o.afterEnd)o.afterEnd.call(this, vis());
                        running = false;
                    });
                    if (!o.circular) {
                        $(o.btnPrev).removeClass("carousel-prev-disabled");
                        $(o.btnNext).removeClass("carousel-next-disabled");
                        if (curr - o.scroll < 0)$(o.btnPrev).addClass("carousel-prev-disabled");
                        if (curr + o.scroll > itemLength - v)$(o.btnNext).addClass("carousel-next-disabled");
                    }
                }
                return false;
            };
        });
    };
    function css(el, prop) {
        return parseInt($.css(el[0], prop)) || 0;
    };
    function width(el) {
        return el[0].offsetWidth + css(el, 'marginLeft') + css(el, 'marginRight');
    };
    function height(el) {
        return el[0].offsetHeight + css(el, 'marginTop') + css(el, 'marginBottom');
    };
})(jQuery);