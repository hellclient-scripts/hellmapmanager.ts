import { assert } from "chai";
import { Snapshot, SnapshotSearch, SnapshotHelper } from '../src/index';
describe("SnapSearchHelperTest", () => {

    it("TestSnapSearch", () => {
        var snapshots: Snapshot[] = [
            ((): Snapshot => {
                let model = new Snapshot();
                model.Key = "test1"
                model.Type = "type1"
                model.Group = "group1"
                model.Value = "value1"
                model.Count = 1
                return model;
            })(),
            ((): Snapshot => {
                let model = new Snapshot();
                model.Key = "test1"
                model.Type = "type1"
                model.Group = "group1"
                model.Value = "value2"
                model.Count = 2
                return model;
            })(),
            ((): Snapshot => {
                let model = new Snapshot();
                model.Key = "test2"
                model.Type = "type2"
                model.Group = "group1"
                model.Value = "value1"
                model.Count = 3
                return model;
            })(),
            ((): Snapshot => {
                let model = new Snapshot();
                model.Key = "test1"
                model.Type = "type2"
                model.Group = "group1"
                model.Value = "value1"
                model.Count = 4
                return model;
            })(),
            ((): Snapshot => {
                let model = new Snapshot();
                model.Key = "test2"
                model.Type = "type1"
                model.Group = "group2"
                model.Value = "value3"
                model.Count = 5
                return model;
            })(),
        ]
        var ss = new SnapshotSearch();
        var sr = SnapshotHelper.Search(ss, snapshots);
        assert.equal(2, sr.length);
        assert.equal("test1", sr[0].Key);
        assert.equal(3, sr[0].Items.length);
        assert.equal(7, sr[0].Sum);
        assert.equal(7, sr[0].Count);
        assert.equal("test2", sr[1].Key);
        assert.equal(2, sr[1].Items.length);
        assert.equal(8, sr[1].Sum);
        assert.equal(8, sr[1].Count);
        ss = ((): SnapshotSearch => {
            let model = new SnapshotSearch();
            model.Type = "type1"
            model.Group = "group1"
            model.Keywords = ["va", "lue"]
            model.PartialMatch = true
            model.Any = false
            return model;
        })()
        sr = SnapshotHelper.Search(ss, snapshots);
        assert.equal(1, sr.length);
        assert.equal("test1", sr[0].Key);
        assert.equal(2, sr[0].Items.length);
        assert.equal(7, sr[0].Sum);
        assert.equal(3, sr[0].Count);
        ss = ((): SnapshotSearch => {
            let model = new SnapshotSearch();
            model.Type = "type2"
            model.Keywords = ["value1", "value"]
            model.PartialMatch = false
            model.Any = true
            return model;
        })()
        sr = SnapshotHelper.Search(ss, snapshots);
        assert.equal(2, sr.length);
        assert.equal("test1", sr[0].Key);
        assert.equal(1, Object.keys(sr[0].Items).length);
        assert.equal(7, sr[0].Sum);
        assert.equal(4, sr[0].Count);
        assert.equal("test2", sr[1].Key);
        assert.equal(1, Object.keys(sr[1].Items).length);
        assert.equal(8, sr[1].Sum);
        assert.equal(3, sr[1].Count);
        ss =
            ((): SnapshotSearch => {
                let model = new SnapshotSearch();
                model.Keywords = ["value1", "value2"]
                model.PartialMatch = false
                model.Any = false
                return model;
            })()
        sr = SnapshotHelper.Search(ss, snapshots);
        assert.isEmpty(sr);

        ss = ((): SnapshotSearch => {
            let model = new SnapshotSearch();
            model.Type = "type2"
            model.Keywords = ["value3", "value4", "ue1"]
            model.PartialMatch = true
            model.Any = false
            return model;
        })()

        sr = SnapshotHelper.Search(ss, snapshots);
        assert.isEmpty(sr);
        ss = ((): SnapshotSearch => {
            let model = new SnapshotSearch();
            model.Type = "type2"
            model.Keywords = ["value3", "value4", "ue1"]
            model.PartialMatch = true
            model.Any = false
            model.MaxNoise = 2
            return model;
        })()

        sr = SnapshotHelper.Search(ss, snapshots);
        assert.equal(sr.length,2);
    })
})