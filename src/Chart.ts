import * as d3 from 'd3';
import d3Cloud from 'd3-cloud';
import $ from 'jquery';
import { Margin } from './Margin';
import { Word } from './Word';

export class Chart {
    private svg;
    private wordList: Word[] = [];
    private margin: Margin = { top: 10, right: 10, bottom: 10, left: 10 };
    private width: number;
    private height: number;
    private _font: string = 'YuGothic';
    private _color: string = '#555'

    constructor() {
        this.width = Number($('#svg').width()) - this.margin.left - this.margin.right;
        this.height = Number($('#svg').height()) - this.margin.top - this.margin.bottom;
        this.svg = this.getInitSVG();
    }

    private getInitSVG() {
        return d3.select("#svg").append("svg").attr('id', 'fig');
    }

    public entryWordList(_wordList: Word[]) {
        this.wordList = _wordList;
    }

    private resizeByWordSize() {
        let minWidth = 200;
        let baseWidth = Math.max(...this.wordList.map(w => w.word.length * w.size)) * 12;

        baseWidth = Math.max(baseWidth, minWidth);
        this.width = baseWidth - this.margin.left - this.margin.right;
        this.height = baseWidth - this.margin.top - this.margin.bottom;

        $('#svg').width(this.width);
        $('#svg').height(this.height);

        this.svg.attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    public draw() {
        this.resizeByWordSize();

        const drawWordCloud = (words: any[]) => {
            console.log(words)
            this.svg.append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", (d: any) => d.size)
                .style("fill", this._color)
                .style("font-weight", "bold")
                .attr("text-anchor", "middle")
                .style("font-family", this._font)
                .attr("transform", (d: any) => {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text((d: any) => d.text);
        }

        // console.table(this.wordList);
        let layout = d3Cloud()
            .size([this.width, this.height])
            .words(this.wordList.map(d => {
                return { text: d.word, size: d.size }
            }))
            .rotate(0)
            .padding(d => Number(d.size) / 10)
            .fontSize(d => Number(d.size) * 10)
            .spiral("archimedean")
            .on("end", drawWordCloud);
        layout.start();
    }

    public redraw() {
        $('#svg > svg').remove();
        this.svg = this.getInitSVG();
        this.draw();
    }

    public set font(f: string) {
        this._font = f;
    }
    public set color(c: string) {
        this._color = c;
    }
}