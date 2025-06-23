document.addEventListener('DOMContentLoaded', () => {
    const flowchart = document.getElementById('flowchart');
    

function createCard(name, data) {
    // Determine contractor type
    let cardClass = '';
    if (data.type === 'contractor') {
        if (data.title && data.title.includes('TDS')) {
            cardClass = 'contractor-tds';
        } else {
            cardClass = 'contractor-dc';
        }
    }

    const card = document.createElement('div');
    card.className = `card ${cardClass}`;
    card.dataset.level = data.level || '';
    
    card.innerHTML = `
        <div class="card-name">${name}</div>
        <div class="card-title">${data.title || ''}</div>
        <div class="card-level">${data.level || ''}</div>
    `;

    if (data.subordinates && data.subordinates.length > 0) {
        const children = document.createElement('div');
        children.className = 'children';
        
        // Add vertical connector
        const verticalConnector = document.createElement('div');
        verticalConnector.className = 'connector connector-vertical';
        children.appendChild(verticalConnector);

        // Create horizontal connector if more than one subordinate
        if (data.subordinates.length > 1) {
            const horizontalConnector = document.createElement('div');
            horizontalConnector.className = 'connector connector-horizontal';
            horizontalConnector.style.width = `${(data.subordinates.length - 1) * 220}px`;
            children.appendChild(horizontalConnector);
        }

        data.subordinates.forEach(subName => {
            if (orgData[subName]) {
                const subCard = createCard(subName, orgData[subName]);
                children.appendChild(subCard);
            }
        });

        card.appendChild(children);

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            children.classList.toggle('active');
        });
    }

    return card;
}
    

    window.initializeChart = function() {
        const rootCard = createCard('DECKER, TED', orgData['DECKER, TED']);
        flowchart.appendChild(rootCard);
    }

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allCards = document.querySelectorAll('.card');
        
        allCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const shouldShow = text.includes(searchTerm);
            card.style.display = shouldShow ? '' : 'none';
            
            if (shouldShow) {
                let parent = card.parentElement;
                while (parent.classList.contains('children')) {
                    parent.classList.add('active');
                    parent = parent.parentElement.parentElement;
                }
            }
        });
    });

    // Expand/Collapse functionality
    document.getElementById('expandAll').addEventListener('click', () => {
        document.querySelectorAll('.children').forEach(child => {
            child.classList.add('active');
        });
    });

    document.getElementById('collapseAll').addEventListener('click', () => {
        document.querySelectorAll('.children').forEach(child => {
            child.classList.remove('active');
        });
    });

    initializeChart();
});