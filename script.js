document.addEventListener('DOMContentLoaded', function() {
    let votingLocked = false;
    fetch('test_results/test_results.json')
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            const votes = new Array(data.length).fill(null); // Track votes for each test

            data.forEach((test, index) => {
                const testDescription = document.createElement('div');
                testDescription.className = 'test-description';
                testDescription.textContent = test.test_description;
                resultsContainer.appendChild(testDescription);

                const notificationContainer = document.createElement('div');
                notificationContainer.className = 'push-notification-container';

                // Agent keys to be shuffled
                let agentKeys = ['original_agent_result', 'second_agent_result', 'third_agent_result', 'context_original_agent_result'];
                agentKeys = shuffleArray(agentKeys);

                agentKeys.forEach((agentKey, agentIndex) => {
                    const agentName = {
                        'original_agent_result': 'Original Agent',
                        'second_agent_result': 'Second Agent',
                        'third_agent_result': 'Third Agent',
                        'context_original_agent_result': 'Context Altered Original'
                    }[agentKey];
                    const agentResult = JSON.parse(test[agentKey]);
                    const pushNotification = document.createElement('div');
                    pushNotification.className = 'push-notification';
                    pushNotification.setAttribute('data-test-id', agentKey);
                    const agentNameLine = document.createElement('div');
                    agentNameLine.className = 'agent-name-line';
                    agentNameLine.textContent = agentName;
                    agentNameLine.style.display = 'none'; // Initially hidden
                    pushNotification.appendChild(agentNameLine);

                    const title = document.createElement('h2');
                    title.textContent = agentResult.title;
                    pushNotification.appendChild(title);

                    const body = document.createElement('p');
                    body.textContent = agentResult.body;
                    pushNotification.appendChild(body);

                    pushNotification.onclick = () => {
                        if (votingLocked) return;
                        // Deselect any previously selected notification in this row
                        const siblings = notificationContainer.children;
                        for (let sibling of siblings) {
                            sibling.classList.remove('selected');
                        }
                        // Select the clicked notification
                        pushNotification.classList.add('selected');
                        votes[index] = agentKey;
                        checkAllVotes();
                    };

                    notificationContainer.appendChild(pushNotification);
                });

                resultsContainer.appendChild(notificationContainer);
            });

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }

                return array;
            }

            function checkAllVotes() {
                if (votes.every(vote => vote !== null)) {
                    displayResults();
                }
            }

            function displayResults() {
                const resultsSummary = document.createElement('div');
                resultsSummary.className = 'results-summary';
                resultsSummary.textContent = 'Voting Results:';
            
                const agentWins = {
                    'original_agent_result': 0,
                    'second_agent_result': 0,
                    'third_agent_result': 0,
                    'context_original_agent_result': 0
                };
            
                votes.forEach(vote => {
                    agentWins[vote]++;
                });
            
                Object.entries(agentWins).forEach(([agentKey, count]) => {
                    const agentName = {
                        'original_agent_result': 'Original Agent',
                        'second_agent_result': 'Second Agent',
                        'third_agent_result': 'Third Agent',
                        'context_original_agent_result': 'Context Altered Original'
                    }[agentKey];
            
                    const result = document.createElement('p');
                    result.textContent = `${agentName}: ${count} votes`;
                    resultsSummary.appendChild(result);
                });
            
                resultsContainer.appendChild(resultsSummary);
                const agentNameLines = document.querySelectorAll('.agent-name-line');
                agentNameLines.forEach(line => {
                    line.style.display = 'block'; // Make agent names visible
                });
                const agentExplanations = document.getElementById('agent-explanations');
                agentExplanations.style.display = 'block';
            }
        })
        .catch(error => console.error('Error loading test results:', error));
});