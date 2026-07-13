const button = document.getElementById('calculate');

button.addEventListener('click', () => {

    const steelWeight = Number(
        document.getElementById('steelWeight').value
    );

    const steelPrice = Number(
        document.getElementById('steelPrice').value
    );

    const laborCost = Number(
        document.getElementById('laborCost').value
    );

    const otherCost = Number(
        document.getElementById('otherCost').value
    );


    const materialCost = steelWeight * steelPrice;


    const totalCost = 
        materialCost + laborCost + otherCost;


    const quote =
        totalCost * 1.15;


    const profit = quote - totalCost;

const profitRate = 
    (profit / totalCost * 100).toFixed(2);


document.getElementById('resultText').textContent =
`
材料成本：${materialCost} 元

总成本：${totalCost} 元

建议报价：${quote} 元

预计利润：${profit} 元

利润率：${profitRate}%
`;

});
