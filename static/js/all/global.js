var hash = window.location.hash.replace("#", "");

/*
    Restore missing functionality in < IE9 and other browsers
*/

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

/*
    Custom cookie function for dealing with CSRF
*/

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function() {
    /*
        FIX BOOTSTRAP DROP-DOWNS FOR IPAD
    */
    
    $('body')
        .on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); })
        .on('touchstart.dropdown', '.dropdown-submenu', function (e) { e.preventDefault(); });
        
    /*
        FIX BUTTON VALUE IN <IE8
    */
        
    function getInternetExplorerVersion()
    // Returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
    {
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == 'Microsoft Internet Explorer')
      {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
          rv = parseFloat( RegExp.$1 );
      }
      return rv;
    }
    var internetExplorer = getInternetExplorerVersion();
    if (internetExplorer !== -1 && internetExplorer <= 7.0)
    {
        $("form").on('click', "button", function()
        {
            var f = $(this).get(0).form;

            if (typeof(f) !== 'undefined')
            {
                if (this.type && this.type != 'submit')
                {
                    return;
                }

                $("input[type='hidden'][name='" + this.name + "']", f).remove();

                if (typeof($(this).attr("value")) !== 'undefined')
                {
                    $(f).append('<input type="hidden" name="' + this.name + '" value="' + $(this).attr("value") + '">');
                }
                    
                $(f).trigger('submit');
            }
        });
    }
    
    /*
        ENABLE TOOLSTRIPS VIA CSS CLASS
    */
    
    $(".tooltip-enable").tooltip({container: "body"});
    
    /* SHOW ACTIVE TAB AND MAINTAIN CORRECT SIZE */
    
    $('ul.nav a').filter(function() {
        return this.href == window.location;
    }).parent().addClass('active');
	
    /*
        AUTOMATIC PROMPT MESSAGES
    */
    
	$(document).delegate(".prompt", "click", function(e) {
		if (!confirm($(this).data("prompt").replace(/\[n\]/g, "\n"))) {
			e.preventDefault();
		}
	});
    
    /*
        ALLOW NOTICES TO BE HIDDEN
    */
	
	$(".notice").click(function() {
		window.location.hash = "no-message";
		$(this).fadeOut();
	});

    /*
        DATATABLES FOR BOOTSTRAP
    */
    
    /* Set the defaults for DataTables initialisation */
    $.extend( true, $.fn.dataTable.defaults, {
        "bAutoWidth": false,
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        }
    } );


    /* Default class modification */
    $.extend( $.fn.dataTableExt.oStdClasses, {
        "sWrapper": "dataTables_wrapper form-inline"
    } );


    /* API method to get paging information */
    $.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
    {
        return {
            "iStart":         oSettings._iDisplayStart,
            "iEnd":           oSettings.fnDisplayEnd(),
            "iLength":        oSettings._iDisplayLength,
            "iTotal":         oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
            "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
        };
    };


    /* Bootstrap style pagination control */
    $.extend( $.fn.dataTableExt.oPagination, {
        "bootstrap": {
            "fnInit": function( oSettings, nPaging, fnDraw ) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function ( e ) {
                    e.preventDefault();
                    if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                        fnDraw( oSettings );
                    }
                };

                $(nPaging).addClass('pagination').append(
                    '<ul>'+
                        '<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
                        '<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
                    '</ul>'
                );
                var els = $('a', nPaging);
                $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
                $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
            },

            "fnUpdate": function ( oSettings, fnDraw ) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                if ( oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                }
                else if ( oPaging.iPage <= iHalf ) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
                    // Remove the middle elements
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                    // Add the new list items and their event handlers
                    for ( j=iStart ; j<=iEnd ; j++ ) {
                        sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                        $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                            .insertBefore( $('li:last', an[i])[0] )
                            .bind('click', function (e) {
                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                                fnDraw( oSettings );
                            } );
                    }

                    // Add / remove disabled classes from the static elements
                    if ( oPaging.iPage === 0 ) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }

                    if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
            }
        }
    } );


    /* Table initialisation */
    $(document).ready(function() {
        $('#example').dataTable( {
            "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page"
            }
        } );
    } );
    
    /*
        HANDLE BUTTON GROUPS ON FORMS
    */
    
    $(".btn-group[data-toggle-for] .btn").on("click", function(event)
    {
        var $btnGroup = $(this).parent(), $target = $($btnGroup.data("toggle-for"));
        var value;
        var $this = $(this);
        
        event.stopPropagation();
        
        if ($this.data("value"))
        {
            value = $this.data("value");
        } else
        {
            value = $this.val();
        }
        
        if (value == $target.val())
        {
            $this.removeClass("active");
            
            value = "";
        } else
        {
            $this.button("toggle");
        }
        
        $target.val(value).trigger("change");
    });
    
    /*
        AUTOMATICALLY INSERT CLOSE BUTTON INTO ALERTS
    */
    
    $(".alert").each(function()
    {
        var $this = $(this);
        
        var $closeButton = $('<button type="button" />');
        $closeButton
            .addClass("close")
            .html("&times;")
            .attr("data-dismiss", "alert");
        
        if ($this.find("button").length == 0)
        {
            $this.prepend($closeButton);
        }
    });
    
    /*
        FEEDBACK FORM
    */
        
    $("#send-feedback").click(function (event)
    {
        feedback = $("#id_feedback").val();
        
        $("#feedback-response")
            .text("Your feedback is being sent")
            .addClass("alert-info")
            .removeClass("alert-error alert-success")
            .show();
        
        $.ajax({
            url: "/api/json/feedback/",
            type: "POST",
            datatype: "json",
            data: {feedback: feedback},
            success: function (data) {
                data = $.parseJSON(data);
                
                if (data.error)
                {
                    // DISPLAY ERROR NOTICE
                    
                    $("#feedback-response")
                        .text(data.error.description)
                        .addClass("alert-error")
                        .removeClass("alert-success alert-info");
                } else
                {
                    // DISPLAY NOTICE
                    
                    $("#feedback-response")
                        .text(data.description)
                        .addClass("alert-success")
                        .removeClass("alert-error alert-info");
                    
                    // CLEAR TEXT BOX IF SUCCESSFUL
                    
                    $("#id_feedback").val("");
                }
            },
            error: function () {
                alert("error");
            },
            beforeSend: addCsrfToken
        });
    });
    
    /*
        ADD CSRF TOKEN TO JQUERY REQUEST
    */
    
    function addCsrfToken(xhr)
    {
        xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
    }
    
    // Automatically track links using the data API
    
    $("[data-event-trigger=\"click\"]").click(function() {
        var category = $(this).data("event-category");
        var action = $(this).data("event-action");
        var label = $(this).data("event-label");
        
        _gaq.push(['_trackEvent', category, action, label]);
    });
});
