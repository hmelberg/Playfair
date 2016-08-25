//////////////////// MISCELLANEOUS INTERFACE ///////////////////////////
// This section contains playfair interface functions that do not merit
// their own section and are not part of the graphic package itself.

// detect width changes - if < 1200, then graphdiv needs to be align-right
var width = $(window).width();
$(window).resize(function(){
	if($(this).width() < 1200){
		$('#graphdiv').addClass('text-right')
		$('#graphdiv').removeClass('text-center')
		$('#help_general').css('width','calc(100% - 765px)')
		$('#help_text').css('width','calc(100% - 765px)')
	}
	if($(this).width() >= 1200){
		$('#graphdiv').addClass('text-center')
		$('#graphdiv').removeClass('text-right')
		$('#help_general').css('width','calc((100% - 785px)/2)')
		$('#help_text').css('width','calc((100% - 785px)/2)')
	}
});

$(document).ready(function(){
	if($(window).width()<1200){
		$('#graphdiv').addClass('text-right')
		$('#graphdiv').removeClass('text-center')
		$('#help_general').css('width','calc(100% - 765px)')
		$('#help_text').css('width','calc(100% - 765px)')
	}
})

function highlight_element(ev) {
	if(selected==0){
		// this should handle basically every case of mousing over a data element and getting a highlight effect
		item=Snap(ev.target)

		try{
			if(ev.target.nodeName=='tspan'){
				item=item.parent()
			}
		} catch(err){}
		
		try{
			if(item.attr('context')){
				item.attr({filter:shadowfilter})
				hovered=1	
			}
		} catch(err){}


		try{
			if(ev.target.className.baseVal=='dataelement'){
				coords=item.getBBox()
				highlighttext=grapharea.text(coords.x2+10,coords.y+coords.height/2,item.attr('data_label')).attr({'font-family':'Lato, Arial, sans-serif','font-size':16,'text-anchor':'start','fill':'black','font-weight':400,cursor:'pointer'})
				hovered=1
			}
		} catch(err){}
	}
}

function unhighlight_element(ev) {
	if(selected==0 & hovered==1){
		item=Snap(ev.target)

		try{
			if(ev.target.nodeName=='tspan'){
				item=item.parent()
			}
		} catch(err){}

		try{
			if(item.attr('context')){
				item.node.removeAttribute('filter')
				hovered=0
			}

			try{
				if(ev.target.className.baseVal=='dataelement'){
					highlighttext.remove()
					hovered=0
				}
			}catch(err){}
			
		} catch(err){}
	}
}

$('.panel-custom').on('show.bs.collapse', function () {
     $(this).addClass('fun');
});

$('.panel-custom').on('hide.bs.collapse', function () {
     $(this).removeClass('fun');
});

/////////////////////// END MISCELLANEOUS //////////////////////////////
////////////////////////////////////////////////////////////////////////



///////////////////////////// THEMES ///////////////////////////////////
// Initialize the theme dropdown and handle changes

var colormenu="<li><span class='colorbox' style='background-color:#205946' onclick=change_color(clickedevent.target,'#205946')></span><span class='colorbox' style='background-color:#33836A' onclick=change_color(clickedevent.target,'#33836A')></span><span class='colorbox' style='background-color:#67c2a5' onclick=change_color(clickedevent.target,'#67c2a5')></span><span class='colorbox' style='background-color:#b7dfd1' onclick=change_color(clickedevent.target,'#b7dfd1')></span><span class='colorbox' style='background-color:#e2f2ed' onclick=change_color(clickedevent.target,'#e2f2ed')></span></span><span class='colorbox' style='background-color:#ffffff' onclick=change_color(clickedevent.target,'#ffffff')></span></li><li><span class='colorbox' style='background-color:#8e2a1d' onclick=change_color(clickedevent.target,'#8e2a1d')></span><span class='colorbox' style='background-color:#c63f26' onclick=change_color(clickedevent.target,'#c63f26')></span><span class='colorbox' style='background-color:#f58c63' onclick=change_color(clickedevent.target,'#f58c63')></span><span class='colorbox' style='background-color:#fbcdbb' onclick=change_color(clickedevent.target,'#fbcdbb')></span><span class='colorbox' style='background-color:#fef1eb' onclick=change_color(clickedevent.target,'#fef1eb')></span></span><span class='colorbox' style='background-color:#000000' onclick=change_color(clickedevent.target,'#000000')></span></li><li><span class='colorbox' style='background-color:#24385B' onclick=change_color(clickedevent.target,'#24385B')></span><span class='colorbox' style='background-color:#3F578C' onclick=change_color(clickedevent.target,'#3F578C')></span><span class='colorbox' style='background-color:#8c9fca' onclick=change_color(clickedevent.target,'#8c9fca')></span><span class='colorbox' style='background-color:#ccdaf0' onclick=change_color(clickedevent.target,'#ccdaf0')></span><span class='colorbox' style='background-color:#f1f3f9' onclick=change_color(clickedevent.target,'#f1f3f9')></span></span><span class='colorbox' style='background-color:#a3a3a3' onclick=change_color(clickedevent.target,'#a3a3a3')></span></li><li><span class='colorbox' style='background-color:#e78ac3' onclick=change_color(clickedevent.target,'#e78ac3')></span><span class='colorbox' style='background-color:#a6d854' onclick=change_color(clickedevent.target,'#a6d854')></span><span class='colorbox' style='background-color:#ffd92f' onclick=change_color(clickedevent.target,'#ffd92f')></span><span class='colorbox' style='background-color:#e5c494' onclick=change_color(clickedevent.target,'#e5c494')></span><span class='colorbox' style='background-color:#ece9e8' onclick=change_color(clickedevent.target,'#ece9e8')></span></span><span class='colorbox' style='background-color:#c3c3c3' onclick=change_color(clickedevent.target,'#c3c3c3')></span></li>"

$(document).ready(function(){
	$.ajax({
		url:'cgi-bin/listthemes.py',
		method: 'post',
		datatype: 'html',
		data: 1,
		success: function(response){
			var response = JSON.parse(response);
			console.log(response)
			$.each(response,function(key,value){
				value=value.split('.')[0]
				$('#themes').append($('<option>',{value:value}).text(value))
			})

			$("#themes").val('Equitable Growth')
			$('#themes').prop('disabled', false);
			change_theme()
		},
		error: function() {
			change_theme()
		}
	})
})

function change_theme(){
	if($('#themes').val()!='none'){
		var option=$('#themes').val()+'.txt'
		var dictionary={'loadtheme':option}

		$.ajax({
			url:'cgi-bin/loadtheme.py',
			method: 'post',
			datatype: 'html',
			data: dictionary,
			success: function(response){
				var response = JSON.parse(response);
				theme=response
				var theme=default_style(theme)
				change_colormenu(theme)
				populate_settings(theme)
			},
			error: function(){
				alert("Something is wrong with this theme. Use a JSON validator to make sure it is a valid object.")
			}
		})
	} else {
		theme={}
		var theme=default_style(theme)
		change_colormenu(theme)
		populate_settings(theme)
	}
}

function change_colormenu(theme){
	// change colormenu if the theme has a new colormenu
	if(theme['colormenu']){
		colormenu=''
		for(var i=0;i<theme.colormenu.colormenu.length;i++){
			if(i%6==0){
				colormenu=colormenu+"<li><span class='colorbox' style='background-color:"+theme['colormenu'][i]+"' onclick=change_color(clickedevent.target,'"+theme['colormenu'][i]+"')></span>"
			} else {
				colormenu=colormenu+"<span class='colorbox' style='background-color:"+theme['colormenu'][i]+"' onclick=change_color(clickedevent.target,'"+theme['colormenu'][i]+"')></span>"
			}
		}
		$('#colormenu').empty()
		$('#colormenu').append(colormenu)
	}
}

function populate_settings(theme){
	// empty settings
	$('#settings').html("<div class='v-nav'><ul class='unselectable'></ul></div>")

	// create settings fields
	var vnav=$('#settings ul')
	var body=$('#settings .v-nav')
	var j=0
	for(var key in theme){
		if(j==0){
			vnav.append("<li tab='"+key+"' id=settings_first class='first current'>"+key+"</li>")
			j=1
		} else {
			vnav.append("<li tab='"+key+"'>"+key+"</li>")
		}
		body.append("<div class='tab-content' id='sett_"+key+"'>")
		var tab=$('#sett_'+key)
		var i=0
		for(var sub in theme[key]){
			if(i==3){
				i=0
			}
			if(i==0){
				tab.append("<div class='row'></div>")
			}
			i=i+1
			var row=$('#sett_'+key+' .row:last-of-type')
			row.append("<div class='col-md-4'><div class='labeled_elewide'><label>"+sub+"</label><span class='styled-inputwide'><input type='text styled-input' id='"+sub+"' data-key='"+key+"'></span></div></div>")
		}
	}

	// change settings fields placeholders to current theme values
	var settings=$('#settings input')
	for(var i=0;i<settings.length;i++){
		var param=settings[i].id
		var key=$('#'+param).attr('data-key')
		settings[i].placeholder=theme[key][param]
	}
	vtabs()
}

///////////////////////// VERTICAL TABS ////////////////////////////////
// Completely ripped these vertical tabs off from this jsfiddle:
// http://jsfiddle.net/frabiacca/7pm7h/5/
// Thanks frabiacca!

function vtabs() {
	var items=$('.v-nav>ul>li').each(function() {
		$(this).click(function(){
			items.removeClass('current');
			$(this).addClass('current');
			$('.v-nav>div.tab-content').hide().eq(items.index($(this))).show();
		})
	})

	$('#data_first').click()
}


