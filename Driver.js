function calculate()
{
    var a = parseInt(document.querySelector("#value1").value);
    var b = parseInt(document.querySelector("#value2").value);
    var op = document.querySelector("#operator").value;
    var calc;

    if(op == "add")
    {
        calc = a + b;
    }
    else if (op = "min")
    {
        calc = a - b;
    }
    else if (op = "div")
    {
        calc = a / b;
    }
    else if (op = "mul")
    {
        calc = a * b;
    }

    console.log(calc);
}