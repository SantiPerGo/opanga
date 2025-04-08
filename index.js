// Initialize search form functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupSearchForm();

    // Add event listener for file input change
    const fileLoader = document.getElementById('fileLoader');
    fileLoader.addEventListener('change', handleFileSelect);
});