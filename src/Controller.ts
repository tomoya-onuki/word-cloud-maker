import $ from 'jquery';
import { Chart } from './Chart';
import { Word } from './Word';

export class Controller {
    private chart: Chart;
    private wordFormLen = 0;

    constructor(chart: Chart) {
        this.chart = chart;
        this.addWordForm();
    }

    public redrawEvent() {
        $('#redraw-btn').on('click', () => {
            this.redraw();
        });
    }

    public addWordFormEvent() {
        $('#add-word-btn').on('click', () => {
            this.addWordForm();
        });
    }

    public saveImageEvent() {
        $('#save-btn').on('click', () => {
            this.saveFigbyPNG();
        });
    }

    private addWordForm() {
        let addElem = $('<div></div>')
            .attr('id', `word${this.wordFormLen}-form`)
        let textElem = $('<input>')
            .attr('id', `word${this.wordFormLen}`)
            .attr('type', 'text')
            .attr('placeholder', 'word');
        let numberElem = $('<input>')
            .attr('id', `word${this.wordFormLen}-size`)
            .attr('type', 'range')
            .attr('min', 1)
            .attr('max', 5)
            .attr('step', 1)
            .val(1);
        let delBtnElem = $('<button></button>')
            .attr('id', `word${this.wordFormLen}-del-btn`)
            .text('delete')
            .on('click', () => {
                addElem.remove();
            });
        addElem.append(textElem, numberElem, delBtnElem);

        $('#word-form-list').append(addElem);
        this.wordFormLen++
    }

    private redraw() {
        let wordList: Word[] = []
        $('#word-form-list').children().each((i, elem) => {
            let word: string = String($(elem).children('input[type="text"]').val());
            let wordSize: number = Number($(elem).children('input[type="range"]').val());

            wordList.push({
                word: word,
                size: wordSize
            });
        });
        this.chart.entryWordList(wordList);
        this.chart.color = String($('#font-color-selector').val());
        this.chart.font = String($('#font-selector').val());
        this.chart.redraw();
    }

    public defaultMode() {
        this.addWordForm();
        $('#word0').val('Welcome!');
        $('#word0-size').val(4);
        $('#word1').val('WordCloudMaker');
        $('#word1-size').val(2);
        this.redraw();
    }

    private saveFigbyPNG() {
        console.log('start')
        const input: any = document.querySelector('#fig');
        const svgData = new XMLSerializer().serializeToString(input);
        const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))
        const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;
    
        const image = new Image();
        image.addEventListener('load', () => {
            const canvas = document.createElement('canvas');
            const width: number = input.getAttribute('width') * devicePixelRatio;
            const height: number = input.getAttribute('height') * devicePixelRatio;
    
            canvas.setAttribute('width', String(width));
            canvas.setAttribute('height', String(height));
    
            const context = <CanvasRenderingContext2D>canvas.getContext('2d')
            context.drawImage(image, 0, 0, width, height);
    
            canvas.toBlob((blob: any) => {
                const url: any = URL.createObjectURL(blob);
                const crntDate = new Date();
                let outname = `wcm-download-${crntDate.toLocaleDateString()}_${crntDate.toLocaleTimeString()}.png`
                $('<a>', {
                    href: url,
                    download: outname
                })[0].click()
    
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1E4);
            }, 'image/png');
        });
        image.src = svgDataUrl;
    }
}