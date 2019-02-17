function calculate()
{
    // Some of this stuff is rather normal or expected so I won't be commenting too much.

    // So what we are doing here with the variables is setting their values. Basic, right?
    // Clearly, it is different than x = y
    // the parseInt function just turns the incoming string into an int
    // and the other parts are just saying 
    // "From within this document I want to select this thing with this ID and it's a value"
    var a = parseInt(document.querySelector("#value1").value);
    var b = parseInt(document.querySelector("#value2").value);
    var op = document.querySelector("#operator").value;
    var calc;

    if(op == "add")
    {
        calc = a + b;
    }
    else if (op == "min")
    {
        calc = a - b;
    }
    else if (op == "div")
    {
        calc = a / b;
    }
    else if (op == "mul")
    {
        calc = a * b;
    }

    // used this before to see our result, but then we made an element to show the user the result
    // console.log(calc);
    document.querySelector("#result").innerHTML = calc;
}