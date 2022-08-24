// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

enum Ranges {
    start = 0,
    end = 1,
}

interface MyRange {
    key: [number, number];
    getRange: (range: [number, number]) => number[];
}

class RangeList {
    /**
     * Create a range of numbers
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     * @return {Array<number>}
     */
    private static createRange(range: [number, number]): number[] {
        // get start and end of the range
        const start: number = range[Ranges.start];
        const end: number = range[Ranges.end] - 1;


        const res: number[] = [];
        for (let i = start; i <= end; i++) {
            res.push(i);
        }
        return res;
    }

    private static handleException(range: [number, number]): void {
        if (
            isNaN(range[Ranges.start]) || isNaN(range[Ranges.end])
            ||
            range.length > 2
        ) {
            throw new Error('Requires [start, end] as an valid input.');
        }
    }

    private rangeList: MyRange[] = [];

    /**
     * Adds a range to the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    public add(range: [number, number]): void {
        RangeList.handleException(range);

        // get start and end of the range
        const inputRangeStart: number = range[Ranges.start];
        const inputRangeEnd: number = range[Ranges.end];

        if(this.rangeList.length <= 0) return;
        const rangeListLen = this.rangeList.length;
        for (let i = 0; i < rangeListLen; i++) {
            const FirstStart: number = this.rangeList[i].key[Ranges.start];

            for (let j = i; j < rangeListLen; j++) {
                const SecondStart: number = this.rangeList[j].key[Ranges.start];
                const SecondEnd: number = this.rangeList[j].key[Ranges.end];

                if (inputRangeStart >= FirstStart && inputRangeEnd <= SecondEnd) {
                    //If original range contains the input range
                    //do nothing
                    return;
                }
                else if (inputRangeEnd > SecondEnd && inputRangeStart <= SecondEnd) {
                    // extend array with a new range
                    this.rangeList[j].key = [SecondStart, inputRangeEnd];
                }
            }
        }

        this.saveRange(range);
    }

    /**
     * Removes a range from the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    public remove(range: [number, number]): void  {
        RangeList.handleException(range);

        const inputRangeStart: number = range[Ranges.start];
        const inputRangeEnd: number = range[Ranges.end];

        let deletelIndex = -1;

        const rangeListLen = this.rangeList.length;
        for (let i = 0; i < rangeListLen; i++) {
            const FisrtStart: number = this.rangeList[i].key[Ranges.start];
            const FirstEnd: number = this.rangeList[i].key[Ranges.end];

            if (
                inputRangeStart > FisrtStart && inputRangeEnd < FirstEnd
                &&
                FirstEnd - inputRangeEnd > 1
            ) {
                // Breaking Input: [15, 19)
                // RangeList: [11, 21)
                // Output: [11, 15) [19, 21)

                this.rangeList[i].key = [inputRangeEnd, FirstEnd];

                this.rangeList.splice(i, 0, {
                    getRange: RangeList.createRange,
                    key: [FisrtStart, inputRangeStart],
                });
            }
            else if (inputRangeStart >= FisrtStart && inputRangeEnd <= FirstEnd) {
                // Boundary Input: [10, 11)
                // RangeList: [1, 5) [10, 21)
                // Output: [1, 5) [11, 21)

                this.rangeList[i].key = [inputRangeEnd, FirstEnd];
            }
            else if (this.rangeList.length >= 2) {
                // Acrossing Input: [4, 18)
                // RangeList: [1, 8) [11, 15) [17, 21)
                // Output: [1, 4) [18, 21)

                for (let j = i + 1; j < rangeListLen; j++) {
                    // current range
                    const SecondEnd: number = this.rangeList[j].key[Ranges.end];

                    if (
                        inputRangeStart <= FirstEnd
                        &&
                        inputRangeEnd < SecondEnd
                    ) {
                        this.rangeList[i].key = [FisrtStart, inputRangeStart];

                        this.rangeList[j].key = [inputRangeEnd, SecondEnd];

                        deletelIndex = i;
                        break;
                    }
                }
            }
        }

        if (deletelIndex > 0) {
            this.rangeList.splice(deletelIndex, 1);
        }
    }

    /**
     * Prints Rangelists
     */
    public print(): void {
        let output = '';
        for (const item of this.rangeList) {
            output += `${item.getRange(item.key)} `;
        }
        console.log(output);
    }

    private saveRange(range: [number, number]): void {
        const newRange: MyRange = {
            getRange: RangeList.createRange,
            key: range,
        };

        this.rangeList.push(newRange);
        this.rangeList.sort((a, b) => a.key[Ranges.start] - b.key[Ranges.start]);
    }
}

// Example run
const rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)

rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)

rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)

rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)