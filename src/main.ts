import { Chart } from './Chart';
import { Controller } from './Controller';

window.onload = () => {
    const chart: Chart = new Chart();
    const controller: Controller = new Controller(chart);
    controller.redrawEvent();
    controller.addWordFormEvent();
    controller.saveImageEvent();
    
    controller.defaultMode();
    // chart.draw();
};


