var VirtualBook_images_link_array = [];
		
var VirtualBook_previous_picture;
var VirtualBook_current_picture;
var VirtualBook_next_picture;
		
var VirtualBook_current_index;
		
var VirtualBook_canvas;
var VirtualBook_context;
		
var VirtualBook_isVirtualBook_mouse_down_event = false;
var VirtualBook_isAnimating = false;
var VirtualBook_progress = 0;
var VirtualBook_isNext = true;
		
var VirtualBook_animation_sleep_time = 20;
var VirtualBook_width;
var VirtualBook_height;
		
function VirtualBook_show_progress()
{
	if(VirtualBook_progress <= 100 && VirtualBook_progress >= 0)
	{
		var width1 = VirtualBook_width*(100-VirtualBook_progress)/100;
		var width2 = VirtualBook_width*(VirtualBook_progress/2)/100;
		var height = VirtualBook_height;
		
		var picture_width1 = VirtualBook_current_picture.width*(100-VirtualBook_progress)/100;
		var picture_width2 = VirtualBook_current_picture.width*(VirtualBook_progress/2)/100;
		var picture_height = VirtualBook_current_picture.height;
		
		var shadow_width = 20*VirtualBook_progress/100; //TODO modify?
				
		VirtualBook_context.clearRect(0,0,VirtualBook_canvas.width, VirtualBook_canvas.height);
				
		if(VirtualBook_isNext)
		{
			if(VirtualBook_current_index < VirtualBook_images_link_array.length - 1)
			{
				VirtualBook_context.drawImage(VirtualBook_current_picture,0,0,picture_width1,picture_height,0,0,width1,height);
				VirtualBook_context.drawImage(VirtualBook_next_picture,0,0,picture_width2,picture_height,width1,0,width2,height);
				VirtualBook_context.drawImage(VirtualBook_next_picture,picture_width1+picture_width2,0,picture_width2,picture_height,width1+width2,0,width2,height);
					
				VirtualBook_context.fillStyle = "RGBA(0,0,0,0.4)";
				VirtualBook_context.fillRect(width1-shadow_width,0,shadow_width,height);
				VirtualBook_context.fillRect(width1+width2,0,20-shadow_width,height);
			}
			else
			{
				VirtualBook_context.drawImage(VirtualBook_current_picture,0,0,VirtualBook_current_picture.width,VirtualBook_current_picture.height,0,0,VirtualBook_width,height);
			}
		}
		else
		{
			if(VirtualBook_current_index > 0)
			{
				VirtualBook_context.drawImage(VirtualBook_previous_picture,0,0,picture_width1,picture_height,0,0,width1,height);
				VirtualBook_context.drawImage(VirtualBook_current_picture,0,0,picture_width2,picture_height,width1,0,width2,height);
				VirtualBook_context.drawImage(VirtualBook_current_picture,picture_width1+picture_width2,0,picture_width2,picture_height,width1+width2,0,width2,height);
						
				VirtualBook_context.fillStyle = "RGBA(0,0,0,0.4)";
				VirtualBook_context.fillRect(width1-shadow_width,0,shadow_width,height);
				VirtualBook_context.fillRect(width1+width2,0,20-shadow_width,height);
			}
			else
			{
				VirtualBook_context.drawImage(VirtualBook_current_picture,0,0,VirtualBook_current_picture.width,VirtualBook_current_picture.height,0,0,VirtualBook_width,height);
			}
					
		}

	}
}
		
function VirtualBook_animate()
{
	if(VirtualBook_progress > 50 && VirtualBook_progress < 100)
	{
		VirtualBook_isAnimating = true;
		VirtualBook_progress += 1;
		VirtualBook_show_progress();
		setTimeout(VirtualBook_animate,VirtualBook_animation_sleep_time);
	}
	else if (VirtualBook_progress <= 50 && VirtualBook_progress > 0)
	{
		VirtualBook_isAnimating = true;
		VirtualBook_progress -= 1;
		VirtualBook_show_progress();
		setTimeout(VirtualBook_animate,VirtualBook_animation_sleep_time);
	}
	else
	{
		if(VirtualBook_isNext)
		{
			if(VirtualBook_current_index < VirtualBook_images_link_array.length - 1 && VirtualBook_progress == 100)
			{
				++VirtualBook_current_index;
				VirtualBook_set_images();
				VirtualBook_progress = 0;
			}
			VirtualBook_show_progress();
		}
		else
		{
			if(VirtualBook_current_index > 0 && VirtualBook_progress == 0)
			{
				--VirtualBook_current_index;
				VirtualBook_set_images();
				VirtualBook_progress = 100;
			}
			VirtualBook_show_progress();
		}
		VirtualBook_isAnimating = false;
	}
}
		
function VirtualBook_calculate_progress(e)
{
	var xPos = e.clientX - VirtualBook_canvas.offsetLeft;
	VirtualBook_progress = 100 - Math.round(100 * xPos / VirtualBook_canvas.width);
}
	
function VirtualBook_is_in_left_region(e)
{
	var xPos = e.clientX - VirtualBook_canvas.offsetLeft;
	return (xPos > VirtualBook_width*0.9);
}
		
function VirtualBook_is_in_right_region(e)
{
	var xPos = e.clientX - VirtualBook_canvas.offsetLeft;
	return (xPos < VirtualBook_width*0.1);
}
		
function VirtualBook_set_images()
{
	VirtualBook_current_picture = VirtualBook_images_link_array[VirtualBook_current_index];
	if(VirtualBook_current_index > 0)
	{
		VirtualBook_previous_picture = VirtualBook_images_link_array[VirtualBook_current_index - 1];
	}
	else
	{
		VirtualBook_previous_picture = 0;
	}
			
	if(VirtualBook_current_index < VirtualBook_images_link_array.length - 1)
	{
		VirtualBook_next_picture = VirtualBook_images_link_array[VirtualBook_current_index + 1];
	}
	else
	{
		VirtualBook_next_picture = 0;
	}
}
		
function VirtualBook_mouse_move_event(e)
{
	if(VirtualBook_isVirtualBook_mouse_down_event)
	{
		VirtualBook_calculate_progress(e);
		VirtualBook_show_progress();
	}
}
		
function VirtualBook_mouse_down_event(e)
{
	if(!VirtualBook_isAnimating && VirtualBook_is_in_left_region(e))
	{
		VirtualBook_isNext = true;
		VirtualBook_calculate_progress(e);
		VirtualBook_show_progress();
		VirtualBook_isVirtualBook_mouse_down_event = true;
	}
	else if(!VirtualBook_isAnimating && VirtualBook_is_in_right_region(e))
	{
		VirtualBook_isNext = false;
		VirtualBook_calculate_progress(e);
		VirtualBook_show_progress();
		VirtualBook_isVirtualBook_mouse_down_event = true;
	}
}
		
function VirtualBook_mouse_up_event()
{
	if(!VirtualBook_isAnimating)
	{
		VirtualBook_isVirtualBook_mouse_down_event = false;
		VirtualBook_animate();
	}
}
		
function InitializeVirtualBook(canvas_id, width, height, images_link_array)
{
	VirtualBook_width = width;
	VirtualBook_height = height;
			
	for(var i=0; i<images_link_array.length; ++i)
	{
		VirtualBook_images_link_array[i] = new Image();
		VirtualBook_images_link_array[i].src = images_link_array[i];
	}
			
	VirtualBook_current_index = 0;
	VirtualBook_set_images();
			
	VirtualBook_canvas = document.getElementById(canvas_id); 
	VirtualBook_canvas.width = VirtualBook_width; 
	VirtualBook_canvas.height =  VirtualBook_height;
	//Setting events
	VirtualBook_canvas.onmousemove = function(event) { VirtualBook_mouse_move_event(event); }
	VirtualBook_canvas.onmousedown = function(event) { VirtualBook_mouse_down_event(event); }
	VirtualBook_canvas.onmouseup = function(event) { VirtualBook_mouse_up_event(); }
	VirtualBook_canvas.onmouseout = function(event) { VirtualBook_mouse_up_event(); }
			
	VirtualBook_context = VirtualBook_canvas.getContext("2d");
			
	VirtualBook_current_picture.onload = function(){ VirtualBook_show_progress(); }
}