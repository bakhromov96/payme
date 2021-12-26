import { Router, Request, Response } from 'express';
const router = Router();

// Model
//import Task from '../models/Task';
import Users from '../models/Users';
import Address from '../models/Address';

router.route('/create')
    .get((req: Request, res: Response) => {
        res.render('users/create');
    })
    .post(async (req: Request, res: Response) => {
        const { fullname, department,position,addressLive } = req.body;
        
        const users = new Users({ fullname, department,position});
        await users.save();

        const address = new Address({ address: addressLive, user_id: users._id });
        await address.save();
        

        res.redirect('/users/list');
    });
router.route('/search').get((req: Request, res: Response) => {
    const {search} = req.body;
    let searchArray = search.split(" ");
    let regex = [];
    for(let i = 0; i < searchArray.length; i++){
        regex.push({ "fullname": { $regex: '.*' + searchArray[i] + '.*' } });
        regex.push({ "department": { $regex: '.*' + searchArray[i] + '.*' } });
        regex.push({ "position": { $regex: '.*' + searchArray[i] + '.*' } });
    }
    console.log(regex);

    Users.aggregate([{
        $lookup: {
            from: "addresses", // collection name in db
            localField: "_id",
            foreignField: "user_id",
            as: "addresses"
        }
    },
    {
        $match: {
            $or: regex
        }
    }
    ]).exec(function(err, users) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.send({ users });
    });

});


router.route('/list')
    .get(async (req: Request, res: Response) => {
        const users = await Users.find();
        res.render('users/list', { users });
    });

router.route('/delete/:id')
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
        await Users.findByIdAndDelete(id);
        res.redirect('/users/list');
    });

router.route('/edit/:id')
    .get(async (req: Request, res: Response) => {
        const { id } = req.params;
        const users = await Users.findById(id);
        console.log(users)
        res.render('users/edit', { users });
    })
    .post(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { fullname, department,position,addressLive } = req.body;
        await Users.findByIdAndUpdate(id, {
            fullname, department,position
        });

        await Address.findByIdAndUpdate(id, {
            address: addressLive
        });

        res.redirect('/users/list');
    })

export default router;