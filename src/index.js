// remove delete divs
const to_delete = document.getElementsByClassName('delete');
while (to_delete.length > 0) {
    to_delete[0].parentNode.removeChild(to_delete[0]);
}
