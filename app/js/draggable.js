//=========================================//
//=====  Set Up Drag and Drop Methods =====//
//==========================================//

// Make songs in playlist draggable
// Make songs in playlist droppable
// Check if cursor is in top half or bottom half of drop zone

//=========================================//
//=========================================//

let dragging, draggedOver;

// Make songs in playlist draggable:
function initDraggableItems() {
	const songs = document.querySelectorAll('.playlist .playlist__song');

	for (song of songs) {
		setDraggable(song);
		setDroppable(song);
	}
}

function setDraggable(node) {
	node.draggable = true;
	node.addEventListener('dragstart', dragStart);
	node.addEventListener('dragend', dragEnd);
}

function setDroppable(node) {
	node.addEventListener('dragover', dragOver);
	node.addEventListener('drop', dropItem);
}

function dragStart(e) {
	console.dir(e.target);
	dragging = e.target;
	dragging.classList.add('dragging');
}

//this fires when esc key is pressed, or after an item is dropped
function dragEnd(e) {

    //if dragging is not defined, do nothing
    if(!dragging) return;

    dragging.classList.remove('dragging');
    draggedOver.classList.remove('draggedOver');
    dragging = undefined;
    draggedOver = undefined;
}

function dragOver(e) {
    e.preventDefault();

    // if dragging is not defined, do nothing
    if (!dragging) return;

    //skip if this is a child element
    if (!e.target.parentElement.classList.contains('playlist')) return;

    draggedOver?.classList.remove('draggedOver','top','bottom');
    draggedOver = e.target;
    draggedOver.classList.add('draggedOver');

    // e = dragOver event
    let rect = e.target.getBoundingClientRect();
    let y = e.clientY - rect.top; // y position within element
    let height = rect.height;
    let topOrBottom = y > height/2 ? 'bottom':'top';
    draggedOver.classList.add(topOrBottom);
}

function dropItem(e) {
    // if draggin gis not defined, do nothing
    if (!dragging) return;

    if (draggedOver.classList.contains('bottom')) {
        draggedOver.parentNode.insertBefore(dragging, draggedOver.nextSibling);
    } else if (draggedOver.classList.contains('top')) {
        draggedOver.parentNode.insertBefore(dragging, draggedOver);
    }

    // dragEnd will fire next
}
