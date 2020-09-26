if [ $# -eq 0 ]; then
    echo "Not enough arguments supplied."
    exit 1
fi

file_csv=$1
update_script='
use accidents;
db.accidents.updateMany(
    {},
    [
        {
            $set: {
                Loc_start: {
                    type: "Point",
                    coordinates: ["$Start_Lng", "$Start_Lat"]
                },
                Loc_end: {
                    type: "Point",
                    coordinates: {
                        $cond: [
                            {
                                $eq: ["$End_Lng", ""]
                            },
                            ["$Start_Lng", "$Start_Lat"],
                            ["$End_Lng", "$End_Lat"]
                        ]
                    }
                }
            }
        }
    ]
);

db.accidents.createIndex({Loc_start: "2dsphere"})
db.accidents.createIndex({Loc_end: "2dsphere"})
'

echo -e "Importing $file_csv...\n"
mongoimport --type csv -d accidents -c accidents --headerline --drop $file_csv

echo -e "Updating database schema...\n"
mongo <<< $update_script
