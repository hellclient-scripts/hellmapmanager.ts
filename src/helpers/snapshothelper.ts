

import { Snapshot } from "../models/snapshot";
import { SnapshotSearch, SnapshotSearchResult } from "../models/snapshotsearchresult";
export class SnapshotHelper {
    static Search(search: SnapshotSearch, snapshots: Snapshot[]): SnapshotSearchResult[] {
        let all: { [key: string]: SnapshotSearchResult } = {};
        for (let snapshot of snapshots) {
            if (all[snapshot.Key] == null) {
                let result = new SnapshotSearchResult();
                result.Key = snapshot.Key
                result.Sum = 0
                result.Count = 0
                result.Items = []
                all[snapshot.Key] = result;

            }
            all[snapshot.Key].Add(snapshot, search.Validate(snapshot));
        }
        let values = Object.values(all);
        let results: SnapshotSearchResult[] = [];
        for (let item of values) {
            if (item.Items.length > 0) {
                results.push(item);
            }
        }
        results.sort((x, y) => x.Key < y.Key ? -1 : 1);
        return results;
    }
}
