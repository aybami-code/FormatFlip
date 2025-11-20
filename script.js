document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const jsonInput = document.getElementById('jsonInput');
    const yamlInput = document.getElementById('yamlInput');
    const copyJsonBtn = document.getElementById('copyJson');
    const copyYamlBtn = document.getElementById('copyYaml');
    const downloadJsonBtn = document.getElementById('downloadJson');
    const downloadYamlBtn = document.getElementById('downloadYaml');
    const formatJsonBtn = document.getElementById('formatJson');
    const clearAllBtn = document.getElementById('clearAll');
    const exampleBtn = document.getElementById('exampleBtn');
    const jsonError = document.getElementById('jsonError');
    const yamlError = document.getElementById('yamlError');

    // Initialize with example data
    setTimeout(() => {
        loadExample();
    }, 500);

    // Event Listeners
    jsonInput.addEventListener('input', () => convertJsonToYaml());
    yamlInput.addEventListener('input', () => convertYamlToJson());
    copyJsonBtn.addEventListener('click', copyJson);
    copyYamlBtn.addEventListener('click', copyYaml);
    downloadJsonBtn.addEventListener('click', () => downloadFile('json-data.json', jsonInput.value));
    downloadYamlBtn.addEventListener('click', () => downloadFile('yaml-data.yaml', yamlInput.value));
    formatJsonBtn.addEventListener('click', formatJson);
    clearAllBtn.addEventListener('click', clearAll);
    exampleBtn.addEventListener('click', loadExample);

    // Conversion Functions
    function convertJsonToYaml() {
        try {
            const jsonValue = jsonInput.value.trim();
            if (!jsonValue) {
                yamlInput.value = '';
                hideError('json');
                return;
            }

            const jsonObj = JSON.parse(jsonValue);
            const yamlStr = jsyaml.dump(jsonObj, { indent: 2 });
            yamlInput.value = yamlStr;
            hideError('json');
            hideError('yaml');
        } catch (error) {
            showError('json', 'Invalid JSON: ' + error.message);
        }
    }

    function convertYamlToJson() {
        try {
            const yamlValue = yamlInput.value.trim();
            if (!yamlValue) {
                jsonInput.value = '';
                hideError('yaml');
                return;
            }

            const jsonObj = jsyaml.load(yamlValue);
            jsonInput.value = JSON.stringify(jsonObj, null, 2);
            hideError('json');
            hideError('yaml');
        } catch (error) {
            showError('yaml', 'Invalid YAML: ' + error.message);
        }
    }

    // Helper Functions
    function showError(type, message) {
        const errorElement = type === 'json' ? jsonError : yamlError;
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    function hideError(type) {
        const errorElement = type === 'json' ? jsonError : yamlError;
        errorElement.classList.add('hidden');
    }

    function copyJson() {
        navigator.clipboard.writeText(jsonInput.value)
            .then(() => showFeedback(copyJsonBtn, 'Copied!'))
            .catch(err => console.error('Failed to copy:', err));
    }

    function copyYaml() {
        navigator.clipboard.writeText(yamlInput.value)
            .then(() => showFeedback(copyYamlBtn, 'Copied!'))
            .catch(err => console.error('Failed to copy:', err));
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function formatJson() {
        try {
            const jsonValue = jsonInput.value.trim();
            if (!jsonValue) return;
            
            const jsonObj = JSON.parse(jsonValue);
            jsonInput.value = JSON.stringify(jsonObj, null, 2);
            hideError('json');
            convertJsonToYaml();
            showFeedback(formatJsonBtn, 'Formatted!');
        } catch (error) {
            showError('json', 'Invalid JSON: ' + error.message);
        }
    }

    function clearAll() {
        jsonInput.value = '';
        yamlInput.value = '';
        hideError('json');
        hideError('yaml');
        showFeedback(clearAllBtn, 'Cleared!');
    }

    function loadExample() {
        const exampleJson = {
            "name": "JsonYaml SynthWave Converter",
            "description": "A beautiful two-way JSON/YAML converter",
            "features": [
                "Realtime conversion",
                "Error highlighting",
                "Copy/download",
                "Beautiful UI",
                "Responsive design"
            ],
            "stats": {
                "speed": "instant",
                "reliability": "99.9%"
            }
        };

        jsonInput.value = JSON.stringify(exampleJson, null, 2);
        convertJsonToYaml();
        showFeedback(exampleBtn, 'Example loaded!');
    }

    function showFeedback(element, message) {
        const originalHTML = element.innerHTML;
        element.innerHTML = `<span class="animate-pulse">${message}</span>`;
        setTimeout(() => {
            element.innerHTML = originalHTML;
            feather.replace();
        }, 1500);
    }
});