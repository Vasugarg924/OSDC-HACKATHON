document.getElementById('publishForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('options').style.display = 'block';
  });
  
  document.getElementById('publishNotes').addEventListener('click', function() {
    // Here you can implement the logic to publish notes/books
    alert('Notes/Books Published!');
  });
  
  document.getElementById('publishLink').addEventListener('click', function() {
    // Here you can implement the logic to publish a link
    alert('Link Published!');
  });
  