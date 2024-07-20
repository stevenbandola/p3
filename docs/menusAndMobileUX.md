podchurch mobile
you can enter fly mode by double tapping both thumbs quickly
exit fly mode when both thumbs are removed
when both thumbs are pushed up, the user is pushed forwards
when one thumb is raised and another is lowered, you steer in the direction of an iscosilice triangle 
when one finger is lifted, the forward thrust is maintained and you switch to x,z thrust directions so the user can gain or lower height and move side to side
the camera slowly eases in the direction you are moving

use the camera of the phone to track eye position and make the phone a window into the game world 
if you eyes are up close, you can see more

the user can set a fly mode exit delay which counts down when the user releases both thumbs
when fly mode exits, shade the game world and pull up the multimenu
mm can be a radial, ribbon, scroll list, or a custom layout based menu
menu items are held in a menu state which can be manipulated with the multi menu manager

the mmm allows admins to add menu items into the menu state by placing menu nodes throught the world
menu nodes can be permanent, or they can require you to be facing them, or be within proximity of them in order to show in the mm
when a menu nodes conditions are fulfilled, the menu is displayed
trigger conditions
proximity 
in view
asset selected


the menu renderer uses the state to display the menu
the user can choose from different menu styles of each menu nodes items such as radial, ribbon, panel

gesture recognition should be based on the path traced by each thumb

menu items have
can be interactable, or display type
if display
type = 
label
iframe


if interactable
type =
select
multiselect
input
button
slider
etc

onClick
onHover
onInspect (fires when a user right clicks, press and holds, or b)

they can have an absolute x,y
they can belong to a group
appear animation (fade, wipe, from behind, etc)
disappear animation (explode, wither, evaporate)
effects

groups can have a title, list of menu item ids, 
groups also have all the properties as menu items, so they are rendered at the same time

by default, menus are rendered in panels and ordered first to last so admins can quickly create menus while also having access to developer level control

the menus are stored in a database and queries using the users coordinates in the menu request
the menu request is sent while the user is exiting fly mode according the requestInitOffset (default 0)

if a menu item is hud, 
the hud listener will maintain a websocket for updates to the menu items
mask


to start, create a mm that shows a list of buttons
make the buttons selectable
make a sphere around the player when menu is open
make a button that can play/pause the video
make a button that can switch between two pods
enable/disable voice chat
teleport to entrance

make a group

make a button to join mailing list
make a button that can navigate the user to a webpage
make a button to donate
make a store with merch

for navigation, show a warning about leaving the session

make a list of joinable pods

make an asset placer

